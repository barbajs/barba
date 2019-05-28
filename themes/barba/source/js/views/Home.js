export default {
  namespace: 'home',
  beforeEnter(data) {
    console.info('views:beforeEnter');
  },
  afterEnter() {
    console.info('views:afterEnter');
  },
  beforeLeave() {
    console.info('views:beforeLeave');
  },
  afterLeave() {
    console.info('views:afterLeave');
  }
}
