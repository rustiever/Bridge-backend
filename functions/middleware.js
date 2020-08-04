//const { error } = require("firebase-functions/lib/logger");
const jwt = require('jsonwebtoken');

module.exports.requestHandler = async(req, res, next) =>{
    req.alreadyLogin = true;
    if(!req.body.token){
        let err = new Error('Something went wrong!!! The required data not given');
        return next(err);
    }
    if(req.body.usn){
        if(!req.body.name || !req.body.email || !req.body.photoUrl ||!req.body.uid  || !req.body.joined){
            let err = new Error('Something went wrong!!! Data insufficient');
            return next(err);
        }
        req.alreadyLogin = false;
        return next();
    }   
    return next();
};

module.exports.requestUser = async (req, res, next) => {
    try{
        var decoded = jwt.decode(req.body.token, { complete : true });
        var user = decoded.payload;
        req.uid = user.user_id;
        if(!req.alreadyLogin){
            if(user.user_id !== req.body.uid || user.email !== req.body.email || user.name !== req.body.name || user.picture !== req.body.photoUrl){
            let err = new Error('The given Data Invalid for the operation');
            return next(err)
            
            }
            req.uid = req.body.uid;
        }
        return next();
    }catch(err){
        return next(err);
    }
};

function UserException(message) {
    this.message = message;
    this.name = 'User-Data Exception';
}


module.exports.usnValidation = function(usn){
    
  let l = usn.length;
  if(l === 10)
  {
    let setFlag = false;
    var branchName ;
    var branch = usn.substr(5,2);
    var year ="20"+ usn.substr(3,2);
    if(!Number.isNaN(parseInt(branch,10)) || branch === parseInt(branch,10)||year !== Number.parseInt(year,10).toString())
    {
      throw new UserException('Invalid USN');
    }
      
    switch (branch)
    {
      case 'CS':branchName = "Computer Science and Engineering".toUpperCase();
                setFlag = true;
                break;
      
      case 'IS':branchName = "Information Science and Engineering".toUpperCase();
                setFlag = true;
                break;
            
      case 'EC':branchName = "Electronics and Communication Engineering".toUpperCase();
                setFlag = true;
                break;
      
      case 'ME':branchName = "Mechanical Engineering".toUpperCase();
                setFlag = true;
                break;
                  
      case 'AE':branchName = "Aeronautical Engineering".toUpperCase();
                setFlag = true;
                break;

      case 'CV':branchName = "Civil Engineering".toUpperCase();
                setFlag = true;
                break;

      case 'MT':branchName = "Mechatronics Engineering".toUpperCase();
                setFlag = true;
                break;
      
      default: break;
    }
      
    if(!setFlag)
    {
      throw new UserException('Branch Name Invalid');
    }
    var result = {
      usn : usn,
      branchName : branchName,
      year : year
    }
    return result;
  }
  throw new UserException('Invalid Credentials'); 
};