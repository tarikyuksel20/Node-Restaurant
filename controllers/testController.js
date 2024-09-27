const testUserController = (req, res) =>{
    try{
        res.status(200).json({
            status:"Success",
            message:"Test successfull"
        })
    }catch(err){
        res.status(400).json({
            status:"Faild",
            message: err.message
        })
    }
}

module.exports = testUserController;