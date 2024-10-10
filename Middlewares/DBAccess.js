const DBAccess = (req,res,next) =>{
    
    req.usersCollection = req.app.get('usersCollection')
    req.postsCollection = req.app.get('postsCollection')
    req.metaCollection = req.app.get('metaCollection')

    next();

}

module.exports = DBAccess;