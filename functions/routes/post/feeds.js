const homeRoute = require("express").Router();
const firebase = require("firebase");

const db = require("../../auth/app");
const middleware = require("../../auth/authorization");

function findBranch(branch){
    let b;
}
// need to check edge cases like end of the documents
homeRoute.post("/", async (req, res) => {
    const limit = 15;
    try {
        if(!req.body.userScope){
            return res.status(404).send('Invalid Request');
        }
        var con = true;
        // const qualifier = {
        //     branch: "CS",
        //     batch: 2017,
        //     groups: [
        //         "cc",
        //         "echo",
        //         "ab",
        //         "bc",
        //         "abcd",
        //         "bvv",
        //         "fh",
        //         "mk",
        //         "klk",
        //         "jjj",
        //     ],
        // };
        const qualifier = req.body.userScope;
        var resData = [];
        let time;
        if (req.body.time) {
            const t = req.body.time;
            time = new firebase.firestore.Timestamp(t.seconds,t.nanoseconds);
        }
        else {
            time = null;
        }
        let count = 25;

        while (con) {

            if (count === 0) {
                console.log('After no data it returned for some time');
                break;
            }

            console.log(resData.length.toString() + 'arr len');
            let postsRef;

            if (!time) {
                // eslint-disable-next-line no-await-in-loop
                postsRef = await db.collection("feeds").orderBy("timeStamp", 'desc').limit(limit).get();

                console.log(postsRef.docs.length.toString() + 'how');
            }
            else {
                // eslint-disable-next-line no-await-in-loop
                postsRef = await db.collection("feeds").orderBy("timeStamp", 'desc').startAfter(time).limit(limit).get();
                if (postsRef.empty) {
                    time = null;
                    console.log('breaked due to no data there in the feeds collection !!! ALL are fetched bro...');
                    break;
                }
                console.log(postsRef.docs.length.toString() + 'st');
            }
            if (resData.length >= limit) {
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
                    data.comments = data.comlen;
                    resData.push(data);
                }
                else {
                    if (data.scope.groups === false && (req.body.usertype === 'faculty' || (data.scope.batch === true || (typeof data.scope.batch === "object" && data.scope.batch.includes(qualifier.batch))))) {

                        if (data.scope.branch === true || (typeof data.scope.branch === "object" && data.scope.branch.includes(qualifier.branch))) {
                            data.postId = element.id;
                            data.likes = data.likes.length;
                            data.comments = data.comlen;
                            resData.push(data);
                        }
                    } else if (data.scope.branch === false && data.scope.batch === false && typeof data.scope.groups === "object") {
                        if (data.scope.groups.some((v) => qualifier.groups.indexOf(v) !== -1)) {
                            data.postId = element.id;
                            data.likes = data.likes.length;
                            data.comments = data.commlen;
                            resData.push(data);
                        }
                    }
                }
            });
            // console.log(resData)
            count--;
        }
        console.log(time);
        return res.status(200).send({
            lastTime: time,
            feedData: resData
        });
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = homeRoute;