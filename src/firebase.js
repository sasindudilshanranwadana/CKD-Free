import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCSmC4annBKJ5C66_IH7pgsTLDzygD_N5w",
  authDomain: "kidney-172fe.firebaseapp.com",
  databaseURL: "https://kidney-172fe-default-rtdb.firebaseio.com",
  projectId: "kidney-172fe",
  storageBucket: "kidney-172fe.appspot.com",
  messagingSenderId: "1087778292125",
  appId: "1:1087778292125:web:ad7dc33b0898dd245b6f74",
  measurementId: "G-ZM4TPCPT68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

const updateUserLastLogin = async (uid) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
};

export { auth, db, storage, googleProvider, updateUserLastLogin };
