import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBpEWiJIRXFtvSgzTWEojHpOoDnu84xyCI",
    authDomain: "social-media-app0.firebaseapp.com",
    databaseURL: "https://social-media-app0.firebaseio.com",
    projectId: "social-media-app0",
    storageBucket: "social-media-app0.appspot.com",
    messagingSenderId: "668830960453",
    appId: "1:668830960453:web:cbfe5827f4f9819af20c2c"
};

firebase.initializeApp(firebaseConfig);

export default firebase