const path = require('path')

const ErrorRoutehandler = (req,res,next) =>{
    res.sendFile(path.join(__dirname , 'NotFound.html'))
}

module.exports = ErrorRoutehandler;