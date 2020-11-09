import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// you need to enter your own configuration values
const firebaseConfig = {
    apiKey: "**********************",
    authDomain: "***************",
    databaseURL: "****************",
    projectId: "*****************",
    storageBucket: "*****************",
    messagingSenderId: "*********************************",
    appId: "****************************************"
};

firebase.initializeApp(firebaseConfig);

export default firebase
