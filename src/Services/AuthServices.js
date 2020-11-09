import { fireEvent } from '@testing-library/react';
import firebase from '../firebase'

import {getUserId} from './UserServices'

const auth = firebase.auth()
const db = firebase.firestore()

const checkUserIsSignedIn = () => {
    return firebase.auth().onAuthStateChanged(function (user) {
        // check whether user is signed in or not
        return !user ? false : true
    });
}

// Register a user and save it also to firestore
const signUp = async (email, password, userName) => {
    try {
        await auth.createUserWithEmailAndPassword(email, password)
        const id = await getUserId()

        const userRef = db.collection('users').doc(`${id}`)
        await userRef.set({
            userName,
            email,
            likes:[]
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const login = async (email, password) => {
    try {
        return await auth.signInWithEmailAndPassword(email, password)
    } catch (e) {
        throw new Error(e.message)
    }
}

const logout = async () => {
    try {
        return await auth.signOut()
    } catch (e) {
        throw new Error(e.message)
    }
}


export {
    checkUserIsSignedIn,
    signUp,
    login,
    logout
}