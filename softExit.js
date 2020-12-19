module.exports = (db)=>{
        process.on("exit", ()=>{
                db.client.close()
        })
}
