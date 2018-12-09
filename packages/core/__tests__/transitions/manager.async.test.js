/* eslint-disable no-empty-function */
import { manager } from '../../src/transitions';

// Mocks
const enter = jest.fn();

// Shared
const div = document.createElement('div');
const wrapper = div.cloneNode();
const currentContainer = div.cloneNode();
const nextContainer = div.cloneNode();
// Data
const data = {
  current: {
    container: currentContainer,
  },
  next: {
    html: true,
    container: nextContainer,
  },
};
const payload = 'payload';

/**
 * Just do page…
 * @param {function} leave leave function
 * @returns {undefined}
 */
async function doPage(leave) {
  await manager.doPage({
    transition: { leave, enter },
    data,
    wrapper,
  });
}

it('returns with "promise"', async () => {
  expect.assertions(1);

  const leavePromise = () => Promise.resolve(payload);

  await doPage(leavePromise);
  expect(enter).toHaveBeenCalledWith(data, payload);
});

it('returns with "callback"', async () => {
  expect.assertions(1);

  const leaveCallback = function leaveCallback() {
    const done = this.async(); // eslint-disable-line no-invalid-this

    done(null, payload);
  };

  await doPage(leaveCallback);
  expect(enter).toHaveBeenCalledWith(data, payload);
});

it('returns with "sync"', async () => {
  expect.assertions(1);

  const leaveSync = () => payload;

  await doPage(leaveSync);
  expect(enter).toHaveBeenCalledWith(data, payload);
});
