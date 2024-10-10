const WebSiteCounter = async (req,res,next) =>{
    await req.metaCollection&&req.metaCollection.updateOne({id:1},{$inc:{websiteCalls:1}})
    // handle undefined Error

    next()
}

module.exports = WebSiteCounter;