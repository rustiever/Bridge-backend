const homeRoute = require("express").Router();
const firebase = require("firebase");

const db = require("../../app");
const middleware = require("../auth/middleware");

homeRoute.get("/", async (req, res, next) => {
  try {
    // const docData = await (await db.collection(req.usertype).doc(req.uid).get()).data();
    const docData = await (
      await db.collection("faculties").doc("H3KOr0tq8Wcg5cK8HIY6AeRRZj73").get()
    ).data();
    // const postsRef = await db.collection('posts').orderBy('timeStamp', 'asc').limit(10).get();
    const scopeData = docData.scope;
    var count = 5;
    var qualifier = {
      branch: "CSE",
      batch: "2017",
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
    const postsRef = await db
      .collection("posts")
      .orderBy("timeStamp", "asc")
      .limit(10)
      .get();
    postsRef.forEach((element) => {
      var data = element.data();
      if (typeof data.scope === "boolean") {
        data.postId = element.id;
        data.likes = data.likes.length;
        data.comments = data.comments.length;
        resData.push(data);
      } else {
        if (
          data.scope.batch === true ||
          (typeof data.scope.batch === "object" &&
            data.scope.batch.includes(qualifier.batch))
        ) {
            console.log('batch');
          if (
            data.scope.branch === true ||
            (typeof data.scope.branch === "object" &&
              data.scope.branch.includes(qualifier.branch))
          ) {
            data.postId = element.id;
            data.likes = data.likes.length;
            data.comments = data.comments.length;
            resData.push(data);
            //
          }
        } else if (
          data.scope.branch === false &&
          data.scope.batch === false &&
          typeof data.scope.groups === "object"
        ) {
          if (
            data.scope.groups.some((v) => qualifier.groups.indexOf(v) !== -1)
          ) {
            data.postId = element.id;
            data.likes = data.likes.length;
            data.comments = data.comments.length;
            resData.push(data);
          }
        }
        //else
      }
    });
    console.log(resData);
    return res.status(200).send(resData);
    // return res.status(200).send('done');
  } catch (err) {
    return res.send(err.toString());
  }
});

module.exports = homeRoute;

