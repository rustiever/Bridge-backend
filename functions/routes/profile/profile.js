const profileRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

profileRouter.post('/', middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        //Limit according to the rendering data amount...
        let limit = 25;
        let docsRef;
        let renderData;
        let lastTime = null;
        let time = null;
        const con = true;
        var obj = {};
        var resData = [];
        var count = 10;
        if (req.body.nextCall === false) {
            obj = {
                id: req.uid,
                username: req.userValidData.name,
                groups: req.userValidData.groups,
                email: req.userValidData.email,
                branch: req.userValidData.branch,
                userType: req.userValidData.usertype,
                photoURL: req.userValidData.photoURL
            }
            if (req.userValidData.usn) {
                obj.usn = req.userValidData.usn;
                obj.batch = req.userValidData.batch;
            }
            if (req.userValidData.facultyId) {
                obj.phone = req.userValidData.phone;
                obj.facultyId = req.userValidData.facultyId;
            }
        }
        if (req.body.time) {
            time = firebase.firestore.Timestamp(
                req.body.time.seconds,
                req.body.time.nanoseconds
            );
        }

        if (req.body.requestData === 0) {
            renderData = req.userValidData.likedPosts;
        } else if (req.body.requestData === 1) {
            renderData = req.userValidData.bookmarks;
        } else {
            renderData = req.userValidData.posts;
        }

        while (con) {
            if (resData.length >= limit) {
                break;
            }
            if (count <= 0 && resData.length > 5) {
                break;
            }
            if (!time) {
                // eslint-disable-next-line no-await-in-loop
                docsRef = await db.collection('feeds').orderBy('timeStamp', 'desc').limit(limit).get();
            }
            else {
                // eslint-disable-next-line no-await-in-loop
                docsRef = await db.collection('feeds').orderBy('timeStamp', 'desc').startAfter(time).limit(limit).get();
            }
            if (docsRef.empty) {
                break;
            }

            docsRef.forEach(element => {
                let data = element.data();
                if (renderData.includes(element.id))
                    resData.push({
                        caption: data.caption,
                        cooments: data.comlen,
                        likes: (data.likes).length,
                        postUserType: data.usertype,
                        ownerUid: data.ownerUid,
                        ownerName: data.ownerName,
                        ownerPhotoUrl: data.ownerPhotoUrl,
                        photoUrl: data.photoUrl,
                        scope: data.scope,
                        timeStamp: data.timeStamp

                    });
            });
            count--;
        }
        obj.data = resData;
        return res.status(200).send({ lastTime: lastTime, data: obj });
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = profileRouter;