/** @jsx html */

import { html } from 'snabbdom-jsx';
import Counter from './Counter';
import Type from 'union-type';
import { UpdateResult, pure, withEffects } from '../../../src/UpdateResult.js'

const Action = Type({
  Add     : [],
  Update  : [Number, Counter.Action]
});

const Effect = Type({
  Counter : [Number, Counter.Effect]
});


const view = ({state, dispatch})  =>
    <div>
      <button on-click={[dispatch, Action.Add()]}>Add</button>
      <hr/>
      <div>{
        state.map((item, idx) =>
          <Counter state={item} dispatch={dispatch.map(Action.Update(idx))} />)
      }</div>
    </div>;

const init = () => pure([]);

const addPure = (state, v) => [...state, v];
const updatePure = (state, v, idx) => state.map((item,i) => i === idx ? v : item);

function addCounter(state) {
  return UpdateResult.case({
    Pure : v => pure(addPure(state, v)),
    WithEffects : (v, eff) => withEffects(
                                addPure(state, v),
                                Effect.Counter(state.length, eff))
  }, Counter.init());
}

function updateCounter(state, idx, action) {
  return UpdateResult.case({
    Pure : v => pure(updatePure(state, v, idx)),
    WithEffects : (v, eff) => withEffects(
                                updatePure(state, v, idx),
                                Effect.Counter(idx, eff))
  }, Counter.update(state[idx],action));
}

const update = (state, action) => Action.case({
  Add    : () => addCounter(state),
  Update : (idx, action) => updateCounter(state, idx, action)
}, action);

const execute = (state, effect, dispatch) => Effect.case({
  Counter: (idx, counterEffect) =>
                    Counter.execute(
                        state[idx],
                        counterEffect, dispatch.map(Action.Update(idx)) )
}, effect);

export default { view, init, update, execute, Action, Effect  }
