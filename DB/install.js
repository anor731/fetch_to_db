const {info, err} = require('./../console.js')
module.exports = (db)=>{
        return new Promise(
                (res, rej)=>{
                        let fs = require('fs')
                        let lock = '.db|collections<-created|'
                        let exists = fs.existsSync(lock)
                        if(!exists) {
                                let x
                                let xx = require('./#Shape/Collections.js') 
                                let i = xx.length
                                while(x = xx.shift()) {
                                       ((x)=>{db.createCollection( x , (e, result)=>{
                                             if(!err(e,`[:!>] Collection "${x}" couldn't been created'`), ()=>{rej()}) {                                                
                                                       info(`[: >] Collection "${x}" created`)
                                             }
                                             i=i-1
                                             if(i===0) {
                                                       res(true)
                                             }
                                       })})(x)
                                 }                
                                fs.writeFileSync(lock, 'installed!')
                        } else {
                                res(false)
                        }                  
                })
}
