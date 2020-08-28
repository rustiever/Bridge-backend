const jwt = require('jsonwebtoken');


const secret = require('./config');
const db = require('./app');


//To verify Token...

module.exports.checkToken = async (req, res, next) => {
    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        const decoded = jwt.decode(token, { complete: true });
        const user = decoded.payload;
        req.secret = user.id;
        return next();
    }
    let err = new Error('Invalid Headers');
    err.status = 401;
    return next(err);
};


module.exports.authorizeToken = async (req, res, next) => {
    if (!req.secret) {
        let err = new Error('Invalid operation ;Login first');
        err.status = 401;
        return next(err);
    }
    try {
        const token = jwt.verify(req.token, secret.AuthSecret(req.secret));
        if (!token) {
            let err = new Error('No User Found');
            err.status = 404;
            return next(err);
        }

        const uid = token.id;
        req.uid = uid;
        req.usertype = token.user;
        const docRef = await db.collection('users').doc(uid);
        const docData = (await docRef.get()).data();
        const userToken = docData.token;
        if (userToken.includes(req.token)) {
            return next();
        }
        let err = new Error('not valid user');
        err.status = 401;
        return next(err);
    } catch (err) {
        return next(err);
    }
};


//To register User...

module.exports.addUser = async (req, res, next) => {
    try {
        var branchName;
        var branch;
        var facultyId;
        var phone;
        var usn;
        var year;
        var name = req.userData.name;
        let listval = [];

        if (req.body.usertype === 101) {
            facultyId = req.userData.facultyId.toUpperCase();
            phone = req.userData.phone;
            branch = facultyId.substr(0, 2);

        } else if (req.body.usertype === 202) {
            usn = req.userData.usn.toUpperCase();
            branch = usn.substr(5, 2);
            year = "20" + usn.substr(3, 2);
        }
        // else{
        //The body of Alumni User...
        // }
        switch (branch) {
            case 'CS': branchName = "Computer Science and Engineering".toUpperCase();
                break;

            case 'IS': branchName = "Information Science and Engineering".toUpperCase();
                break;

            case 'EC': branchName = "Electronics and Communication Engineering".toUpperCase();
                break;

            case 'ME': branchName = "Mechanical Engineering".toUpperCase();
                break;

            case 'AE': branchName = "Aeronautical Engineering".toUpperCase();
                break;

            case 'CV': branchName = "Civil Engineering".toUpperCase();
                break;

            case 'MT': branchName = "Mechatronics Engineering".toUpperCase();
                break;
        }
        if (req.body.usertype === 101) {
            req.userData = {
                name: name,
                phone: phone,
                facultyId: facultyId,
                branch: branchName,
                email: req.body.email,
                photoURL: req.photo,
                bookmarks: listval,
                likedPosts: listval,
                groups: listval,
                posts: listval
            };
            return next();
        }
        else if (req.body.usertype === 202) {
            req.userData = {
                name: name,
                usn: usn,
                branch: branchName,
                batch: Number(year),
                email: req.body.email,
                photoURL: req.photo,
                bookmarks: listval,
                likedPosts: listval,
                posts: listval,
                previlages: listval,
                usertype: req.body.usertype,
                groups: listval
            };
            return next();
        }
        //This is not the actual logic but we have to put the anonymous user validation here;
        //Otherwise this code will not be executed at all where usertype is already validated.
        //So put here the code of anonymous User.
        let err = new Error('Something went wrong!!! User Type is not valid');
        err.status = 400;
        return next(err);
    } catch (err) {
        return next(err);
    }
};


module.exports.findUser = async (req, res, next) => {
    try {
        let docRef;
        if (req.body.usertype === 101) {
            docRef = db.collection('uploads/faculty/facultyDetail').doc(req.body.email);
        }
        else if (req.body.usertype === 202) {
            docRef = db.collection("uploads/students/cs").doc(req.body.email);
        }
        // else if(req.body.usertype === 303){
        //This is the field for the ALUMNI USER...
        // }
        else {
            let err = new Error('Something went wrong!!! User Type is not valid');
            err.status = 400;
            return next(err);
        }
        const user = await docRef.get();
        if (!user.exists) {
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
    try {
        if (!req.body.token || !req.body.usertype) {
            let err = new Error('Something went wrong!!! The required data not given');
            err.status = 400;
            return next(err);
        }
        const decoded = jwt.decode(req.body.token, { complete: true });
        const user = decoded.payload;
        if (user.email !== req.body.email) {
            let err = new Error('The given Data Invalid for the operation');
            err.status = 400;
            return next(err);
        }
        req.uid = user.user_id;
        req.photo = user.picture;
        return next();
    } catch (err) {
        return next(err);
    }
};


//To Login the User...

module.exports.validateToken = async (req, res, next) => {
    try {
        if (!req.body.token || !req.body.usertype) {
            let err = new Error('Something went wrong!!! The required data not given');
            err.status = 400;
            return next(err);
        }
        const decoded = jwt.decode(req.body.token, { complete: true });
        const user = decoded.payload;
        req.uid = user.user_id;
        return next();
    } catch (err) {
        return next(err);
    }
};


module.exports.checkId = async (req, res, next) => {
    try {
        const isExists = (await db.collection('users').doc(req.uid).get()).exists;
        if (!isExists) {
            let err = new Error('User Not Found');
            err.status = 401;
            return next(err);
        }
        return next();
    } catch (err) {
        return next(err);
    }

};


//To check the POST data...

module.exports.checkPost = async (req, res, next) => {
    if (!req.body.postId) {
        let err = new Error('No Post is specified');
        err.status = 401;
        return next(err);
    }

    return next();
};


//To Home Page...

module.exports.homeData = async (req, res, next) => {
    const docData = await (await db.collection('faculties').doc("H3KOr0tq8Wcg5cK8HIY6AeRRZj73").get()).data();
    const postsRef = db.collection('posts');
    const scopeData = docData.scope;
    const len = scopeData.length;
    var i = 0;
    while (i < len) {
        if (i < 8)
            var newScope = scopeData.slice(i, i + 8);
        i += 8;
    }
};


resultHandler = async (req, res, next) => {
    objsData = await postsRef.where('scope', 'array-contains-any', newScope).orderBy('timeStamp', 'asc').limit(50).get();
};