import {
  ISchemaPage,
  ITransitionAppear,
  ITransitionData,
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
    appear() {
      this.bar(this.foo);
    },
    foo: 'foo',
  };

  await transitions.doAppear({
    data,
    transition: (t as any) as ITransitionAppear,
  });

  expect(t.bar).toHaveBeenCalledWith(t.foo);
});
