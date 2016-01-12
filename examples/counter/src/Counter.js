/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import { pure, withEffects } from '../../../src/UpdateResult.js'

const Action = Type({
  Increment      : [],
  Decrement      : [],
  IncrementLater : []
})

const Effect = Type({
  IncrementAsync : []
});

const view = ({state, dispatch}) =>
    <div>
      <button on-click={[dispatch, Action.Increment()]}>+</button>
      <div>{state}</div>
      <button on-click={[dispatch, Action.Decrement()]}>-</button>
      <button on-click={[dispatch, Action.IncrementLater()]}>+ (Async)</button>
    </div>;

const init = () => pure(0);

const update = (state, action) => Action.case({
  Increment       : () => pure(state + 1),
  Decrement       : () => pure(state - 1),
  IncrementLater  : () => withEffects(state, Effect.IncrementAsync())
}, action);

function incrementAsync(dispatch) {
  setTimeout(() => dispatch(Action.Increment()), 1000)
}

const execute = (state, effect, dispatch) => Effect.case({
  IncrementAsync: () => incrementAsync(dispatch)
}, effect);

export default { view, init, update, execute, Action, Effect };
