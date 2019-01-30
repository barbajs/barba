export default {
  namespace: 'home',
  beforeEnter (data) {
    //debugger;
    console.info('views:beforeEnter');
  },
  afterEnter () {
    console.info('views:afterEnter');
  },
  beforeLeave () {
    console.info('views:beforeLeave');
  },
  afterLeave () {
    console.info('views:afterLeave');
  }
}