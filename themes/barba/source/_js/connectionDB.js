import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyADgPf9rpJamT3hDg5P9UaCYrFWfxXAHps',
  authDomain: 'barba-v2.firebaseapp.com',
  databaseURL: 'https://barba-v2.firebaseio.com',
  projectId: 'barba-v2',
  storageBucket: 'barba-v2.appspot.com',
  messagingSenderId: '1045458665835',
  appId: '1:1045458665835:web:ae10b06bf726c27f',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;
