import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database'; 

const firebaseConfig = {
    apiKey: "AIzaSyCeFyFAbvnzwt8Ig-p2tIxQswP9N8LugpE",
    authDomain: "dongnaebook-f85d2.firebaseapp.com",
    databaseURL: "https://dongnaebook-f85d2-default-rtdb.firebaseio.com",
    projectId: "dongnaebook-f85d2",
    storageBucket: "dongnaebook-f85d2.appspot.com",
    messagingSenderId: "379315826696",
    appId: "1:379315826696:web:5e03fd0831a1f62df1a1bd"
  };
  

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const realtimeDB = firebase.database(); 

export { db, auth, realtimeDB};
