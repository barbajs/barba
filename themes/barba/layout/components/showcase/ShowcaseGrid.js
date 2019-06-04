import { Component } from 'kapla';
import firebase from 'firebase/app';
import 'firebase/firestore';

import template from 'ejs-compiled-loader!./showcase-item.ejs';

export default class extends Component {
  load() {
    const data = { post: { name: 'Thierry' } };
    console.info('ShowcaseGrid:load');

    const html = template(data);

    console.info('RESULT', html);
    this.$el.innerHTML = html;
    // console.info('TEST', template()(data));
    // // Your web app's Firebase configuration
    // const firebaseConfig = {
    //   apiKey: "AIzaSyADgPf9rpJamT3hDg5P9UaCYrFWfxXAHps",
    //   authDomain: "barba-v2.firebaseapp.com",
    //   databaseURL: "https://barba-v2.firebaseio.com",
    //   projectId: "barba-v2",
    //   storageBucket: "barba-v2.appspot.com",
    //   messagingSenderId: "1045458665835",
    //   appId: "1:1045458665835:web:ae10b06bf726c27f"
    // };
    // // Initialize Firebase
    // firebase.initializeApp(firebaseConfig);

    // const db = firebase.firestore();

    // // Pseudo
    // db.collection('showcases').get().then((snapshot) => {
    //   snapshot.docs.forEach(doc => {
    //     console.log(doc.data());
    //     // template.parse(doc.data());
    //   });
    // });
  }
}
