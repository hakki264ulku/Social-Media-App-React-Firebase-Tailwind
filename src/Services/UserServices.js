import firebase from '../firebase'

const db = firebase.firestore()
const storage = firebase.storage()

const isUserAuthenticated = async (props) => {
    return await new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                props.history.push('/login')
            } else {
                resolve()
            }
        });
    })
}

const getUserId = async () => {
    return await new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                reject('please authenticate first')
            } else {
                resolve(user.uid)
            }
        });
    })
}

const AddPost = async (text) => {
    try {
        const postRef = db.collection('posts').doc()
        const owner = await getUserId()
        const ownerName = await getUserName(owner)

        postRef.set({
            text,
            owner,
            ownerName,
            date: Date.now(),
            likes: [],
            comments: []
        })

    } catch (e) {
        throw new Error(e.message)
    }
}

const GetPosts = async () => {
    try {
        const postRef = db.collection('posts').orderBy('date', 'desc')
        const snapShot = await postRef.get()

        let posts = await Promise.all(snapShot.docs.map(async p => {
            const postData = p.data()
            const user = await getUser(postData.owner)
            postData.postId = p.id
            postData.ownerPhoto = user.url ? user.url : ''
            return postData
        }))

        return posts

    } catch (e) {
        throw new Error(e)
    }
}

const GetPost = async (postId) => {
    try {
        const postRef = db.collection('posts').doc(postId)
        const postData = await (await postRef.get()).data()
        const user = await getUser(postData.owner)

        postData.ownerPhoto = user.url ? user.url : ''

        return postData
    } catch (e) {
        throw new Error(e.message)
    }
}

const getUserName = async (uid) => {
    try {
        const usersRef = db.collection('users').doc(uid)
        const userName = await (await usersRef.get()).data().userName
        return userName
    } catch (e) {
        throw new Error(e.message)
    }
}

const getUser = async (uid) => {
    try {
        const usersRef = db.collection('users').doc(uid)
        const user = (await usersRef.get()).data()
        return user
    } catch (e) {
        throw new Error(e.message)
    }
}

const likePost = async (uid, postId) => {
    try {
        const postRef = db.collection('posts').doc(postId)
        const userRef = db.collection('users').doc(uid)

        await db.runTransaction(async (t) => {
            const post = await t.get(postRef)
            const user = await t.get(userRef)

            const newLikes = (post.data().likes).concat(uid)
            const newLikeds = (user.data().likes).concat(postId)

            // Add user to post as a liker
            t.update(postRef, { likes: newLikes })
            // Add post to user as a liked
            t.update(userRef, { likes: newLikeds })
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const unLikePost = async (uid, postId) => {
    try {
        const postRef = db.collection('posts').doc(postId)
        const userRef = db.collection('users').doc(uid)

        await db.runTransaction(async (t) => {
            const post = await t.get(postRef)
            const user = await t.get(userRef)

            const newLikes = (post.data().likes).filter(p => p !== uid)

            const newLikeds = (user.data().likes).filter(p => p !== postId)

            // Add user to post as a liker
            t.update(postRef, { likes: newLikes })
            // Add post to user as a liked
            t.update(userRef, { likes: newLikeds })
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const commentOnPost = async (uid, postId, text, ownerName) => {
    try {
        const postRef = db.collection('posts').doc(postId)
        // const userRef = db.collection('users').doc(uid)

        await db.runTransaction(async (t) => {
            const post = await t.get(postRef)
            // const user = await t.get(userRef)

            const newComments = (post.data().comments).concat({ owner: uid, text, ownerName })
            // Add user to post as a liker
            t.update(postRef, { comments: newComments })

        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const getComments = async (postId) => {
    try {
        const postRef = db.collection('posts').doc(postId)
        const comments = await (await postRef.get()).data().comments
        return comments
    } catch (e) {
        throw new Error(e)
    }
}

const addProfilePhoto = async (photo, uid) => {
    try {
        const ref = storage.ref()
        const userRef = db.collection('users').doc(uid)
        const photoRef = ref.child(uid)

        await photoRef.put(photo)
        const url = await photoRef.getDownloadURL()
        console.log(url)

        await userRef.set({ url }, { merge: true })

        return (url)
    } catch (e) {
        throw new Error(e.message)
    }
}

const likeNotification = async (liker, ownerOfPost, userName, postID) => {
    try {
        console.log(postID)
        const notificationRef = db.collection('notifications').doc()
        await notificationRef.set({
            liker: userName,
            ownerOfPost,
            isRead: false,
            type: 'like',
            postID
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const commentNotification = async (commenter, ownerOfPost, userName, postID) => {
    try {
        const notificationRef = db.collection('notifications').doc()
        await notificationRef.set({
            commenter: userName,
            ownerOfPost,
            isRead: false,
            type: 'comment',
            postID
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const getNotifications = async () => {
    try {
        const uid = await getUserId()
        const notificationsRef = db.collection('notifications')
        const notifications = await notificationsRef.where('ownerOfPost', '==', uid).where('isRead', '==', false).get()

        if (notifications.empty) {
            console.log('No matching documents.');
            return;
        }
        let nots = []

        notifications.forEach(doc => {
            if (!doc.data().read) {
                nots.push(doc.data())
            }
        });

        return nots

    } catch (e) {

    }
}

const clearNotifications = async () => {
    const uid = await getUserId()
    const notificationsRef = db.collection('notifications')
    const notifications = await notificationsRef.where('ownerOfPost', '==', uid).get()

    if (notifications.empty) {
        console.log('No matching documents.');
        return;
    }

    notifications.forEach(async doc => {
        const ref = notificationsRef.doc(doc.id)
        await ref.set({ isRead: true }, { merge: true })
    });
}

export {
    AddPost,
    GetPosts,
    GetPost,
    getUserId,
    getUserName,
    likePost,
    unLikePost,
    commentOnPost,
    isUserAuthenticated,
    getComments,
    addProfilePhoto,
    getUser,
    likeNotification,
    commentNotification,
    getNotifications,
    clearNotifications
}