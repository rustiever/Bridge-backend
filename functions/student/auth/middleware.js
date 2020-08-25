const jwt = require("jsonwebtoken");

const secret = require("./stuconfig");
const db = require("../../app");

module.exports.addUser = async (req, _res, next) => {
  try {
    var branchName;
    var usn = req.userData.USN.toUpperCase();
    var name = req.userData.Name;
    var branch = usn.substr(5, 2);
    var year = "20" + usn.substr(3, 2);
    switch (branch) {
      case "CS":
        branchName = "Computer Science and Engineering".toUpperCase();
        break;

      case "IS":
        branchName = "Information Science and Engineering".toUpperCase();
        break;

      case "EC":
        branchName = "Electronics and Communication Engineering".toUpperCase();
        break;

      case "ME":
        branchName = "Mechanical Engineering".toUpperCase();
        break;

      case "AE":
        branchName = "Aeronautical Engineering".toUpperCase();
        break;

      case "CV":
        branchName = "Civil Engineering".toUpperCase();
        break;

      case "MT":
        branchName = "Mechatronics Engineering".toUpperCase();
        break;
    }
    let listval = [];
    req.userData = {
      name: name,
      usn: usn,
      branch: branchName,
      batch: Number(year),
      email: req.body.email,
      photoURL: req.photo,
      bookmarks: listval,
      likedPosts: listval,
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports.findUser = async (req, _res, next) => {
  try {
    const docRef = db.collection("uploads/students/cs").doc(req.body.email);
    const user = await docRef.get();
    if (!user.exists) {
      let err = new Error("Something went wrong!!! User not found");
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

module.exports.validateUser = async (req, _res, next) => {
  try {
    if (!req.body.token) {
      let err = new Error(
        "Something went wrong!!! The required data not given"
      );
      err.status = 400;
      return next(err);
    }
    const decoded = jwt.decode(req.body.token, { complete: true });
    const user = decoded.payload;
    if (user.email !== req.body.email) {
      let err = new Error("The given Data Invalid for the operation");
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
module.exports.validateToken = async (req, _res, next) => {
  try {
    if (!req.body.token) {
      let err = new Error(
        "Something went wrong!!! The required data not given"
      );
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

module.exports.checkId = async (req, _res, next) => {
  try {
    const isExists = (await db.collection("users").doc(req.uid).get()).exists;
    if (!isExists) {
      let err = new Error("User Not Found");
      err.status = 401;
      return next(err);
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports.checkToken = async (req, _res, next) => {
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
    const decoded = jwt.decode(token, { complete: true });
    const user = decoded.payload;
    req.secret = user.id;
    return next();
  }
  let err = new Error("Invalid Headers");
  err.status = 401;
  return next(err);
};

module.exports.authorizeToken = async (req, _res, next) => {
  if (!req.secret) {
    let err = new Error("Invalid operation ;Login first");
    err.status = 401;
    return next(err);
  }
  try {
    const token = jwt.verify(req.token, secret.AuthSecret(req.secret));
    if (!token) {
      let err = new Error("No User Found");
      err.status = 404;
      return next(err);
    }

    const uid = token.id;
    req.uid = uid;
    req.usertype = token.user;
    const docRef = await db.collection("users").doc(uid);
    const docData = (await docRef.get()).data();
    const userToken = docData.token;
    if (userToken.includes(req.token)) {
      return next();
    }
    let err = new Error("not valid user");
    err.status = 401;
    return next(err);
  } catch (err) {
    return next(err);
  }
};

module.exports.checkPost = async (req, _res, next) => {
  if (!req.body.postId) {
    let err = new Error("No Post is specified");
    err.status = 401;
    return next(err);
  }

  return next();
};

