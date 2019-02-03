/* eslint-disable no-empty-function */
import { manager } from '../../src/transitions';
import hooks from '../../src/hooks';
import dom from '../../src/dom';
import { attributeSchema } from '../../src/schema';

dom.init({ attributeSchema });

// Mocks
const before = jest.fn();
const after = jest.fn();
const beforeLeave = jest.fn();
const leave = jest.fn();
const afterLeave = jest.fn();
const beforeEnter = jest.fn();
const enter = jest.fn();
const afterEnter = jest.fn();
const leaveCanceled = jest.fn();
const enterCanceled = jest.fn();

hooks.do = jest.fn();

// Dom
const div = document.createElement('div');
const wrapper = div.cloneNode();
const currentContainer = div.cloneNode();
const nextContainer = div.cloneNode();
const nextHtml = `<html>
  <body>
    <div data-barba="wrapper">
      <div data-barba="container" data-barba-namespace="next">
        Next page
      </div>
    </div>
  </body>
</html>`;

// Data
let data;

beforeEach(() => {
  data = {
    current: {
      container: currentContainer,
      html: undefined,
    },
    next: {
      container: nextContainer,
      html: undefined,
    },
  };
});

const page = Promise.resolve(nextHtml);

it('needs transition', async () => {
  expect.assertions(1);

  try {
    await manager.doPage({});
  } catch (e) {
    expect(e).toEqual(new Error('No transition found'));
  }
});

for (let i = 0; i < 2; i++) {
  const sync = i === 0;

  // eslint-disable-next-line no-loop-func
  it('calls methods', async () => {
    expect.assertions(20);

    const t = {
      sync,
      before,
      beforeLeave,
      leave,
      afterLeave,
      beforeEnter,
      enter,
      afterEnter,
      after,
    };

    await manager.doPage({
      transition: t,
      data,
      page,
      wrapper,
    });

    expect(before).toHaveBeenCalledTimes(1);
    expect(before).toHaveBeenCalledWith(data);

    expect(beforeLeave).toHaveBeenCalledTimes(1);
    expect(beforeLeave).toHaveBeenCalledWith(data);

    expect(leave).toHaveBeenCalledTimes(1);
    expect(leave).toHaveBeenCalledWith(data);

    expect(afterLeave).toHaveBeenCalledTimes(1);
    expect(afterLeave).toHaveBeenCalledWith(data);

    expect(beforeEnter).toHaveBeenCalledTimes(1);
    expect(beforeEnter).toHaveBeenCalledWith(data);

    expect(enter).toHaveBeenCalledTimes(1);
    expect(enter).toHaveBeenCalledWith(data, undefined);

    expect(afterEnter).toHaveBeenCalledTimes(1);
    expect(afterEnter).toHaveBeenCalledWith(data);

    expect(after).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenCalledWith(data);

    await manager.doPage({ transition: { leave, enter }, data, wrapper });

    expect(before).toHaveBeenCalledTimes(1);
    expect(leave).toHaveBeenCalledTimes(2);
    expect(enter).toHaveBeenCalledTimes(2);
    expect(after).toHaveBeenCalledTimes(1);
  });
}

it('calls hooks (sync: false)', async () => {
  expect.assertions(11);

  const t = {
    sync: false,
    leave,
    enter,
  };

  await manager.doPage({
    transition: t,
    data,
    page,
    wrapper,
  });

  expect(hooks.do).toHaveBeenCalledTimes(10);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'before', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'beforeLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'leave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(4, 'afterLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(5, 'currentRemoved', data);
  expect(hooks.do).toHaveBeenNthCalledWith(6, 'beforeEnter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(7, 'nextAdded', data);
  expect(hooks.do).toHaveBeenNthCalledWith(8, 'enter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(9, 'afterEnter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(10, 'after', data, t);
});

it('calls hooks (sync: true)', async () => {
  expect.assertions(11);

  const t = {
    sync: true,
    leave,
    enter,
  };

  await manager.doPage({
    transition: t,
    data,
    page,
    wrapper,
  });

  expect(hooks.do).toHaveBeenCalledTimes(10);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'before', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'beforeLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'beforeEnter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(4, 'nextAdded', data);
  expect(hooks.do).toHaveBeenNthCalledWith(5, 'leave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(6, 'enter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(7, 'afterLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(8, 'currentRemoved', data);
  expect(hooks.do).toHaveBeenNthCalledWith(9, 'afterEnter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(10, 'after', data, t);
});

it('catches error (leave, sync: false)', async () => {
  // DEV
  // expect.assertions(3);

  const leaveError = () => {
    throw new Error('test');
  };

  try {
    await manager.doPage({
      transition: { leave: leaveError, leaveCanceled },
      data,
    });
  } catch (e) {
    expect(e).toEqual(new Error('Transition error'));
    // DEV
    // expect(hooks.do).toHaveBeenLastCalledWith('leaveCanceled', data);
    // expect(leaveCanceled).toHaveBeenCalledTimes(1);
  }
});

it('catches error (enter, sync: false)', async () => {
  // DEV
  // expect.assertions(3);

  const enterError = () => {
    throw new Error('test');
  };

  try {
    await manager.doPage({
      transition: {
        leave() {
          return 'foo';
        },
        enter: enterError,
        enterCanceled,
      },
      data,
      page,
      wrapper,
    });
  } catch (e) {
    expect(e).toEqual(new Error('Transition error'));
    // DEV
    // expect(hooks.do).toHaveBeenLastCalledWith('enterCanceled', data);
    // expect(enterCanceled).toHaveBeenCalledTimes(1);
  }
});

it('catches error (leave, sync: true)', async () => {
  // DEV
  // expect.assertions(3);

  const leaveError = () => {
    throw new Error('test');
  };

  try {
    await manager.doPage({
      transition: { sync: true, leave: leaveError, leaveCanceled, enter() {} },
      data,
      page,
      wrapper,
    });
  } catch (e) {
    expect(e).toEqual(new Error('Transition error'));
    // DEV
    // expect(hooks.do).toHaveBeenLastCalledWith('leaveCanceled', data);
    // expect(leaveCanceled).toHaveBeenCalledTimes(1);
  }
});

it('catches error (enter, sync: true)', async () => {
  // DEV
  // expect.assertions(3);

  const enterError = () => {
    throw new Error('test');
  };

  try {
    await manager.doPage({
      transition: { sync: true, leave() {}, enter: enterError, enterCanceled },
      data,
      page,
      wrapper,
    });
  } catch (e) {
    expect(e).toEqual(new Error('Transition error'));
    // DEV
    // expect(hooks.do).toHaveBeenLastCalledWith('enterCanceled', data);
    // expect(enterCanceled).toHaveBeenCalledTimes(1);
  }
});
