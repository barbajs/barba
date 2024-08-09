/* tslint:disable:no-empty */
import { init } from '../../../__mocks__/barba';
import barba from '../../../src';
import { IResponse, ISchemaPage, ITransitionData } from '../../../src/defs';
import { hooks } from '../../../src/hooks';
import { Logger } from '../../../src/modules/Logger';
import { Transitions } from '../../../src/modules/Transitions';

// Silence is gold… :)
Logger.setLevel('off');
const transitions = new Transitions([]);

// Mocks
const before = jest.fn();
const after = jest.fn();
const beforeLeave = jest.fn();
const leave = jest.fn();
const afterLeave = jest.fn();
const beforeEnter = jest.fn();
const enter = jest.fn();
const afterEnter = jest.fn();

hooks.do = jest.fn();

// Dom
const { wrapper, container: currentContainer } = init();

// const div = document.createElement('div');
// const wrapper = div.cloneNode() as HTMLElement;
// const currentContainer = div.cloneNode() as HTMLElement;
// const nextContainer = div.cloneNode() as HTMLElement;
const nextContainer = currentContainer.cloneNode() as HTMLElement;
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
let data: ITransitionData;

beforeEach(() => {
  nextContainer.remove();
  wrapper.appendChild(currentContainer);

  data = {
    current: {
      container: currentContainer,
      html: undefined,
      url: {},
    } as unknown as ISchemaPage,
    next: {
      container: nextContainer,
      html: undefined,
      url: {},
    } as unknown as ISchemaPage,
    trigger: 'barba',
  };
});

const page = Promise.resolve({
  html: nextHtml,
  url: {},
} as IResponse);

it('leaves falsy', async () => {
  expect.assertions(1);

  await transitions.doPage({
    data,
    page,
    transition: { leave: () => Promise.resolve(false) },
    wrapper,
  });
  expect(beforeEnter).not.toHaveBeenCalled();
});

for (let i = 0; i < 2; i++) {
  const sync = i === 0;

  it('calls methods', async () => {
    expect.assertions(20);

    const t = {
      after,
      afterEnter,
      afterLeave,
      before,
      beforeEnter,
      beforeLeave,
      enter,
      leave,
      sync,
    };

    await transitions.doPage({
      data,
      page,
      transition: t,
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

    await transitions.doPage({
      data,
      page: Promise.resolve(),
      transition: { leave, enter },
      wrapper,
    });

    expect(before).toHaveBeenCalledTimes(1);
    expect(leave).toHaveBeenCalledTimes(2);
    expect(enter).toHaveBeenCalledTimes(2);
    expect(after).toHaveBeenCalledTimes(1);
  });
}

it('calls hooks (sync: false)', async () => {
  expect.assertions(11);

  const t = {
    enter,
    leave,
    sync: false,
  };

  await transitions.doPage({
    data,
    page,
    transition: t,
    wrapper,
  });

  expect(hooks.do).toHaveBeenCalledTimes(10);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'before', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'beforeLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'leave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(4, 'afterLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(5, 'nextAdded', data);
  expect(hooks.do).toHaveBeenNthCalledWith(6, 'beforeEnter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(7, 'enter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(8, 'afterEnter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(9, 'currentRemoved', data);
  expect(hooks.do).toHaveBeenNthCalledWith(10, 'after', data, t);
});

it('calls hooks (sync: true)', async () => {
  expect.assertions(11);

  const t = {
    enter,
    leave,
    sync: true,
  };

  await transitions.doPage({
    data,
    page,
    transition: t,
    wrapper,
  });

  expect(hooks.do).toHaveBeenCalledTimes(10);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'before', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'nextAdded', data);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'beforeLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(4, 'beforeEnter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(5, 'leave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(6, 'enter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(7, 'afterLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(8, 'afterEnter', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(9, 'currentRemoved', data);
  expect(hooks.do).toHaveBeenNthCalledWith(10, 'after', data, t);
});

it('catches error (leave, sync: false)', async () => {
  expect.assertions(4);

  const leaveError = () => {
    throw new Error('test');
  };
  const t = { leave: leaveError };

  try {
    await transitions.doPage({
      data,
      page,
      transition: t,
      wrapper,
    });
  } catch (e) {
    expect(e.name).toEqual('BarbaError');
    expect(e.label).toEqual('Transition error [before/after/leave]');
    expect(e.error).toEqual(new Error('test'));
    expect(transitions.isRunning).toBeFalsy();
  }
});

it('catches error (enter, sync: false)', async () => {
  expect.assertions(4);

  const enterError = () => {
    throw new Error('test');
  };
  const t = {
    leave() {
      return Promise.resolve('foo');
    },
    enter: enterError,
  };

  try {
    await transitions.doPage({
      data,
      page,
      transition: t,
      wrapper,
    });
  } catch (e) {
    expect(e.name).toEqual('BarbaError');
    expect(e.label).toEqual('Transition error [before/after/enter]');
    expect(e.error).toEqual(new Error('test'));
    expect(transitions.isRunning).toBeFalsy();
  }
});

it('catches error (leave, sync: true)', async () => {
  expect.assertions(3);

  const leaveError = () => {
    throw new Error('test');
  };
  const t = { sync: true, leave: leaveError, enter() {} };

  try {
    await transitions.doPage({
      data,
      page,
      transition: t,
      wrapper,
    });
  } catch (e) {
    expect(e.name).toEqual('BarbaError');
    expect(e.label).toEqual('Transition error [sync]');
    expect(e.error).toEqual(new Error('test'));
  }
});

it('catches error (enter, sync: true)', async () => {
  expect.assertions(3);

  const enterError = () => {
    throw new Error('test');
  };
  const t = { sync: true, leave() {}, enter: enterError };

  try {
    await transitions.doPage({
      data,
      page,
      transition: t,
      wrapper,
    });
  } catch (e) {
    expect(e.name).toEqual('BarbaError');
    expect(e.label).toEqual('Transition error [sync]');
    expect(e.error).toEqual(new Error('test'));
  }
});

it('catches "global" error (before)', async () => {
  expect.assertions(2);

  const err = new Error('Test');
  const beforeError = () => {
    throw err;
  };
  const t = { sync: true, leave() {}, enter() {}, before: beforeError };

  try {
    await transitions.doPage({
      data,
      page,
      transition: t,
      wrapper,
    });
  } catch (e) {
    expect(e.name).toEqual('Error');
    expect(e).toEqual(err);
  }
});

it('ignores "non transition" errors', async () => {
  expect.assertions(3);
  const tError = new Error('Weird transition error');

  const leaveError1 = () => {
    throw new Error('Timeout error');
  };
  const leaveError2 = () => {
    throw new Error('Fetch error');
  };
  const enterError3 = () => {
    const err = new Error('Request error');

    delete (err as { message?: string }).message;
    (err as any).status = 500;
    throw err;
  };
  const leaveError4 = () => {
    delete (tError as { message?: string }).message;
    throw tError;
  };
  const t1 = { sync: true, leave: leaveError1, enter() {} };
  const t2 = { leave: leaveError2, enter() {} };
  const t3 = { leave() {}, enter: enterError3 };
  const t4 = { leave: leaveError4, enter() {} };

  await transitions.doPage({
    data,
    page,
    transition: t1,
    wrapper,
  });
  await transitions.doPage({
    data,
    page,
    transition: t2,
    wrapper,
  });
  await transitions.doPage({
    data,
    page,
    transition: t3,
    wrapper,
  });

  try {
    await transitions.doPage({
      data,
      page,
      transition: t4,
      wrapper,
    });
  } catch (e) {
    expect(e.name).toEqual('BarbaError');
    expect(e.label).toEqual('Transition error [before/after/leave]');
    expect(e.error).toEqual(tError);
  }
});
