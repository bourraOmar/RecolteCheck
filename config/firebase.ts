import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBkvYr5eMvLO5A_FFSQOJiElE-jruGA5Yw",
  authDomain: "recoltecheck-fde6f.firebaseapp.com",
  projectId: "recoltecheck-fde6f",
  storageBucket: "recoltecheck-fde6f.firebasestorage.app",
  messagingSenderId: "498110246977",
  appId: "1:498110246977:web:279f5bcd1f2b583073d6c0",
  measurementId: "G-HW4FGZP4X2"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;

