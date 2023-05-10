import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database'; 

const firebaseConfig = {
  apiKey: "AIzaSyDj5A80kAmi_nH7cpErcXDe4f3T3jRmAOo",
  authDomain: "dongnaebook-f946f.firebaseapp.com",
  projectId: "dongnaebook-f946f",
  storageBucket: "dongnaebook-f946f.appspot.com",
  messagingSenderId: "1081660599001",
  appId: "1:1081660599001:web:fb56fa1e348d0bee35acc8",
  measurementId: "G-14827WHBKX"
};

  

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const realtimeDB = firebase.database(); 

export { db, auth, realtimeDB};
