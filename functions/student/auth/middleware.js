const jwt = require('jsonwebtoken');

const secret = require('./stuconfig');
const db = require('../../app');

module.exports.addUser = async (req, res, next) => {
    try {
        var branchName;
        var usn = req.userData.USN.toUpperCase();
        var name = req.userData.Name;
        var branch = usn.substr(5,2);
        var year ="20"+ usn.substr(3,2);
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
        }
        req.userData = {
            Name : name,
            USN : usn,
            Branch : branchName,
            Batch : Number(year),
            UserID : req.uid,
            Email : req.body.email,
            PhotoURL : req.photo
        };
        return next();
    } catch (err) {
        return next(err);
    }
};

module.exports.findUser = async (req, res, next) => {
    try {
        const docRef = db.collection('uploads').doc(req.body.email);
        const user = await docRef.get();
        if(!user.exists){
            let err = new Error('Something went wrong!!! User not found');
            err.status = 400;
            return next(err);
        }
        const userData = user.data();
        req.userData = userData;
        return next();
    } catch (err) {
        return next(err);
    }
};

module.exports.validateUser = async (req, res, next) => {
    try{
        if(!req.body.token){
            let err = new Error('Something went wrong!!! The required data not given');
            err.status = 400;
            return next(err);
        }
        const decoded = jwt.decode(req.body.token, { complete : true });
        const user = decoded.payload;
        if(user.email !== req.body.email){
            let err = new Error('The given Data Invalid for the operation');
            err.status = 400;
            return next(err);
        }
        req.uid = user.user_id;
        req.photo = user.picture;
        return next();
    }catch(err){
        return next(err);
    }
};
module.exports.validateToken = async (req, res, next) => {
    try{
        if(!req.body.token){
            let err = new Error('Something went wrong!!! The required data not given');
            err.status = 400;
            return next(err);
        }
        const decoded = jwt.decode(req.body.token, { complete : true });
        const user = decoded.payload;
        req.uid = user.user_id;
        return next();
    }catch(err){
        return next(err);
    }
};

module.exports.checkId = async (req, res, next) => {
    try {
        const isExists =  (await db.collection('users').doc(req.uid).get()).exists;
        if(!isExists){
            let err = new Error('User Not Found');
            err.status = 401;
            return next(err);
        }
        return next();
    } catch (err) {
        return next(err);
    }

};

module.exports.checkToken = async (req, res, next) => {
    if(!secret.AuthSecret()){
        let err = new Error('Invalid operation');
        err.status = 400;
        return next(err);
    }
    req.secret = secret.AuthSecret();
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined')
    {
       const bearer = header.split(' ');
       const token = bearer[1];
       req.token=token;
       return next();
     }
    let err = new Error('Invalid Headers');
    err.status = 401;
    return next(err);
};

module.exports.authorizeToken = async (req, res, next) => {
    if(!req.secret){
        let err = new Error('Invalid operation ;Login first');
        err.status = 401;
        return next(err);
    }
    try{
        const token = jwt.verify(req.token, req.secret);
        if(!token){
            let err = new Error('No User Found');
            err.status = 404;
            return next(err);
        }
        
        const uid = token.id;
        req.uid = uid;
        const docRef = await db.collection('users').doc(uid);
        const docData = (await docRef.get()).data();
        const userToken = docData.token;
        if(userToken.includes(req.token)){
            return next();        
        }
        let err = new Error('not valid user');
        err.status = 401;
        return next(err);   
    }catch(err){
        return next(err);
    }
};