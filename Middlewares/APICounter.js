const APICounter = async (req,res,next) =>{
    await req.metaCollection&&req.metaCollection.updateOne({id:1},{$inc:{apiCalls:1}})
    // handle undefined error

    next();
}

module.exports = APICounter;