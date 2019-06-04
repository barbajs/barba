import { Component } from 'kapla';
import firebase from 'firebase/app';
import 'firebase/firestore';
// Pseudo
// const template = require("ejs-loader!./themes/barba/layout/components/showcase/showcase-item.ejs");

export default class extends Component {
  load() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyADgPf9rpJamT3hDg5P9UaCYrFWfxXAHps",
      authDomain: "barba-v2.firebaseapp.com",
      databaseURL: "https://barba-v2.firebaseio.com",
      projectId: "barba-v2",
      storageBucket: "barba-v2.appspot.com",
      messagingSenderId: "1045458665835",
      appId: "1:1045458665835:web:ae10b06bf726c27f"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();

    // Pseudo
    db.collection('showcases').get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        console.log(doc.data());
        // template.parse(doc.data());
      });
    });
  }
}
