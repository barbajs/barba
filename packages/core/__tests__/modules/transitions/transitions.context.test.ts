import {
  ISchemaPage,
  ITransitionData,
  ITransitionOnce,
} from '../../../src/defs';
import { Logger } from '../../../src/modules/Logger';
import { Transitions } from '../../../src/modules/Transitions';

// Silence is gold… :)
Logger.setLevel('off');
const transitions = new Transitions([]);

// Data
let data: ITransitionData;

beforeEach(() => {
  data = {
    current: {} as ISchemaPage,
    next: {} as ISchemaPage,
    trigger: 'barba',
  };
});

it('calls methods', async () => {
  const t = {
    bar: jest.fn(),
    once() {
      this.bar(this.foo);
    },
    foo: 'foo',
  };

  await transitions.doOnce({
    data,
    transition: t as any as ITransitionOnce,
  });

  expect(t.bar).toHaveBeenCalledWith(t.foo);
});
