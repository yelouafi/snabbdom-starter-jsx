/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from 'snabbdom';
import clazz from 'snabbdom/modules/class';
import props from 'snabbdom/modules/props';
import style from 'snabbdom/modules/style';
import eventListeners from 'snabbdom/modules/eventListeners';
import { UpdateResult } from './UpdateResult.js';

export default function(App, appRootElement) {
    const patch = snabbdom.init([
      clazz, props, style, eventListeners
    ]);

    let state,
        vnode = appRootElement;

    function updateUI() {
      const newVnode = <App state={state} dispatch={dispatch} />;
      vnode = patch(vnode, newVnode);
    }

    function updateStatePure(newState) {
      state = newState;
      updateUI();
    }

    function updateStateWithEffect(newState, effect) {
      updateStatePure(newState);
      App.execute(state, effect, dispatch);
    }

    function handleUpdateResult(updateResult) {
      UpdateResult.case({
        Pure        : updateStatePure,
        WithEffects : updateStateWithEffect
      }, updateResult);
    }

    function dispatch(action) {
      const updateResult = App.update(state, action);
      handleUpdateResult(updateResult);
    }

    handleUpdateResult(App.init());
}
