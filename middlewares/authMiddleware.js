const JWT = require("jsonwebtoken");
module.exports = async (req, res, next) => {
    try{
        //get token
        const token = req.headers["Authorization"].split("")[1]
        JWT.verify(token, process.env.JWT_SECRET,(err, decode)=>{
            if(err){
                return res.status(401).json({
                    status:"Fail",
                    message:"UNauthorize user"
                })
            }
            else{
                req.body.id = decode.id;
                next();
            }
        })
    }catch(err){
        return res.status(500).json({
            status:"Fail",
            message:err.message
        })
    }
}