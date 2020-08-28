const homeRoute = require("express").Router();
const firebase = require("firebase");

const db = require("../../auth/app");
const middleware = require("../auth/middleware");
// need to check edge cases like end of the documents
homeRoute.get("/", async (req, res, next) => {
  const limit = 5;
  try {
    // const docData = await (await db.collection(req.usertype).doc(req.uid).get()).data();
    const docData = await (
      await db.collection("users").doc("H3KOr0tq8Wcg5cK8HIY6AeRRZj73").get()
    ).data();
    // const postsRef = await db.collection('posts').orderBy('timeStamp', 'asc').limit(10).get();
    const scopeData = docData.scope;
    var con = true;
    var qualifier = {
      branch: "CS",
      batch: 2017,
      groups: [
        "cc",
        "echo",
        "ab",
        "bc",
        "abcd",
        "bvv",
        "fh",
        "mk",
        "klk",
        "jjj",
      ],
    };
    var resData = [];
    let time = null;//time = req.body.timeval;
    
    while (con) {
      console.log(resData.length.toString()+'arr len');
      let postsRef;
      // eslint-disable-next-line no-await-in-loop
      if (!time) { 
        // eslint-disable-next-line no-await-in-loop
        postsRef = await db.collection("posts").orderBy("timeStamp", 'desc').limit(limit).get(); 
        
        console.log(postsRef.docs.length.toString() + 'how');
      }
      // eslint-disable-next-line no-await-in-loop
      else { postsRef = await db.collection("posts").orderBy("timeStamp", 'desc').startAfter(time).limit(limit).get(); 
      console.log(postsRef.docs.length.toString() + 'st' );
    
    }
      if (resData.length >= limit) 
       {
        console.log('breaking the while loop');
        break;
      }
      
      // if( postsRef.docs.length < limit) {
      //   console.log('why 90');
      //   break;
      // };

      let last = postsRef.docs[postsRef.docs.length - 1];
      time = last.data().timeStamp;
      console.log(time);
      postsRef.forEach(element => {
        let data = element.data();
        if (typeof data.scope === "boolean" && data.scope === false) {
          data.postId = element.id;
          data.likes = data.likes.length;
          data.comments = data.comments.length;
          resData.push(data);
        }
        else {
          if (data.scope.groups === false && (req.body.usertype === 'faculty' || (data.scope.batch === true || (typeof data.scope.batch === "object" && data.scope.batch.includes(qualifier.batch))))) {

            if (data.scope.branch === true || (typeof data.scope.branch === "object" && data.scope.branch.includes(qualifier.branch))) {
              data.postId = element.id;
              data.likes = data.likes.length;
              data.comments = data.comments.length;
              resData.push(data);
            }
          } else if (data.scope.branch === false && data.scope.batch === false && typeof data.scope.groups === "object") {
            if (data.scope.groups.some((v) => qualifier.groups.indexOf(v) !== -1)) {
              data.postId = element.id;
              data.likes = data.likes.length;
              data.comments = data.comments.length;
              resData.push(data);
            }
          }
        }
      });
      // console.log(resData)
    }
    return res.status(200).send(resData);
  } catch (err) {
    return res.send(err.toString());
  }
});

module.exports = homeRoute;

