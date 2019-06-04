import { Component } from 'kapla';
import db from '../../../source/js/connectionDB';

import template from 'ejs-compiled-loader!./showcase-item.ejs';

export default class extends Component {
  load() {
    db.collection('showcases').get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.$el.innerHTML = template(doc.data());
        });
      });
  }
}
