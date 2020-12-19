const DB_KEYS = require("./DB_KEYS/mongo.js")
const { MongoClient } = require("mongodb")
const { err, info } = require('./console.js')
const install = require('./DB/install.js')
const softExit = require('./softExit.js')
const CoinGecko = require('coingecko-api');

info(``)
info(``)

let rConnector = (onConnected, database)=>{
        return (e, client)=>{
               let db = client.db(database)
               if(!err(e,`[:!:] Cannot work with unconnected database`)) {               
                        info(`[:x:] Connected & Authenticated`)
                        onConnected(db)
                        softExit(db)
               } 
        }
}

let connect = (config, onConnected)=>{
        (new MongoClient(       
                config[0],
                {
                        auth: {
                                user: config[1],
                                password: config[2]
                        },
                        useUnifiedTopology: true,
                } ,         
        ))
         .connect(
                rConnector(onConnected, config[3])
        )
}

((keepUp)=>{
        connect(DB_KEYS, (db)=>{
                install(db).then(
                        (res)=>{
                                if(res) {info(`[:>>] Installed collections!`)}
                                else    {info(`[:^:] Collections already installed`)}
                                ((db)=>{
                                        
                                        db.collections((e, collections)=>{
                                                if(!err(e, `[:!:] Couldn't list collections...'`)) {
                                                        info(``)
                                                        info(`[:=:] We have ${collections.length} collections in database.`)
                                                        info(``)                
                                                } 
                                        })
                                                                
                                })(db)
                        },
                        (rej)=>{
                                info(`[:!:] One collection failed, install cannot continue!`)
                        }
                ).finally(()=>{
                        keepUp(db)
                })
        })
})((db)=>{

        let coins = []
        let API = new CoinGecko();
        API.coins.list().then(
                (res)=>{
                        res.forEach((x)=>{
                        
                                       coins.push(x.symbol)
                                       db.collection("coins").insertOne(x, (e, res)=>{
                                             if(!err(e, `[:x:] Couldn't insert into "coins collection"'`)) {
                                                        // void
                                             }                                       
                                       })                    
                                       ((x)=>{db.createCollection( `24hHistoryGecko_${x.symbol}` , (e, result)=>{
                                             if(!err(e,`[:!>] Collection for "${x.symbol}" couldn't been created'`)) {
                                                                                          
                                                       info(`[: >] Collection "${x.symbol}" created`)
                                             }
                                       })})(x)  
                                                             
                        })
                },
                (rej)=>{err(rej, `[:!:] Rejected promise`)}
        ).finally(()=>{
                
        })

})

info(``)
info(``)
