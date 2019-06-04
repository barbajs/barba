import { Component } from 'kapla';
import db from '../../../source/js/connectionDB';
// Pseudo
// const template = require("ejs-loader!./themes/barba/layout/components/showcase/showcase-item.ejs");

export default class extends Component {
  load() {
    // Pseudo
    db.collection('showcases').get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          console.log(doc.data());
          // template.parse(doc.data());
        });
      });
  }
}
