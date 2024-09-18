import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBrCoQ8Clo-P-uVVWT2-PAZkW2HBvUJYyg',
  authDomain: 'auth-app-a7a4b.firebaseapp.com',
  projectId: 'auth-app-a7a4b',
  storageBucket: 'auth-app-a7a4b.appspot.com',
  messagingSenderId: '1096750464566',
  appId: '1:1096750464566:web:9753978b030c130c446297',
  measurementId: 'G-T7N54HKT6X',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
