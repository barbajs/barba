import { ISchemaPage, ITransitionData } from '../../../src/defs';
import { hooks } from '../../../src/hooks';
import { Transitions } from '../../../src/modules/Transitions';

const transitions = new Transitions();
// Mocks
const enter = jest.fn();

// Shared
const div = document.createElement('div');
const wrapper = div.cloneNode() as HTMLElement;
const currentContainer = div.cloneNode() as HTMLElement;
const nextContainer = div.cloneNode() as HTMLElement;
// Data
const data: ITransitionData = {
  current: {
    container: currentContainer,
  } as ISchemaPage,
  next: {
    container: nextContainer,
  } as ISchemaPage,
  trigger: 'barba',
};
const payload = 'payload';

/**
 * Just do page…
 */
async function doPage(leave: any) {
  await transitions.doPage({
    data,
    page: Promise.resolve(),
    transition: { leave, enter },
    wrapper,
  });
}

beforeEach(() => {
  hooks.init();
});

it('returns with "promise"', async () => {
  expect.assertions(1);

  const leavePromise = () => Promise.resolve(payload);

  await doPage(leavePromise);
  expect(enter).toHaveBeenCalledWith(data, payload);
});

it('returns with "callback"', async () => {
  expect.assertions(1);

  const ctx: any = {
    leaveCallback() {
      const done = this.async();

      done(null, payload);
    },
  };

  await doPage(ctx.leaveCallback);
  expect(enter).toHaveBeenCalledWith(data, payload);
});

it('returns with "sync"', async () => {
  expect.assertions(1);

  const leaveSync = () => payload;

  await doPage(leaveSync);
  expect(enter).toHaveBeenCalledWith(data, payload);
});
