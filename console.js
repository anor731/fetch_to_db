const info  = console.info
const err   = (e, errorInfo, cf=()=>{})=>{
        cf()
        if(e!==null) {
                info(errorInfo)
                console.error(e)
                return true
        }
        return false       
}

module.exports = {
        info, err
}
