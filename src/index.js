/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from 'snabbdom';
import clazz from 'snabbdom/modules/class';
import props from 'snabbdom/modules/props';
import style from 'snabbdom/modules/style';
import eventListeners from 'snabbdom/modules/eventListeners';
import { UpdateResult } from './UpdateResult.js';

export default function(RootComponent, domElement) {
    const patch = snabbdom.init([
      clazz, props, style, eventListeners
    ]);

    let state,
        vnode = domElement;

    function updateUI() {
      const newVnode = <RootComponent state={state} dispatch={dispatch} />;
      vnode = patch(vnode, newVnode);
    }

    function updateStatePure(newState) {
      state = newState;
      updateUI();
    }

    function updateStateWithEffect(newState, effect) {
      updateStatePure(newState);
      RootComponent.execute(state, effect, dispatch);
    }

    function handleUpdateResult(updateResult) {
      UpdateResult.case({
        Pure        : updateStatePure,
        WithEffects : updateStateWithEffect
      }, updateResult);
    }

    function dispatch(action) {
      const updateResult = RootComponent.update(state, action);
      handleUpdateResult(updateResult);
    }

    handleUpdateResult(RootComponent.init());
}
