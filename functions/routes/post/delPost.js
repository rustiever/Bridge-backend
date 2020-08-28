const postRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

postRouter.post('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        const docRef = db.collection('feeds').doc(req.body.postId);
        if (!(await docRef.get()).exists) {
            let err = new Error('No Post is specified');
            return res.status(404).send(err.message);
        }
        const com = 'comments';
        await deleteCollection(docRef, com, 50);
        // await docRef.delete();
        return res.status(200).send('Done deletion of the post');
    } catch (err) {
        return res.send(err.toString());
    }
});

async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = await collectionRef.orderBy('time').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

module.exports = postRouter;