/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import Status from './RequestStatus';
import { pure, withEffects } from '../../../src/UpdateResult.js'
import api from './api';

/*
  state: {
    name      : String, current username input
    password  : String, current paswword input
    status    : Status, status of the last request
  }
*/

const Action = Type({
  Name        : [String],
  Password    : [String],
  Login       : [],
  LoginSuccess: [String],
  LoginError  : [String]
});

const Effect = Type({
  Login : []
});

function onInput(dispatch, action) {
  return e => dispatch(action(e.target.value));
}

function onSubmit(dispatch) {
  return e => {
    e.preventDefault();
    dispatch(Action.Login());
    return false;
  }
}

const view = ({
  state: {name, password, status},
  dispatch
}) =>

  <form classNames="login" on-submit={onSubmit(dispatch)}>
    <h1>Login</h1>

    <input classNames="name"
      type="text"
      placeholder="User name"
      value={name}
      on-input={onInput(dispatch, Action.Name)} />

    <input classNames="password"
      type="password"
      placeholder="Password"
      value={password}
      on-input={onInput(dispatch, Action.Password)} />

    <div classNames="status"
      class-success={Status.isSuccess(status)}
      class-error={Status.isError(status)}
      >{statusMsg(status)}</div>

    <button disabled={Status.isPending(status)} >Sign in</button>
  </form>;

const statusMsg = Status.case({
  Empty   : () => '',
  Pending : () => 'Logging in ...',
  Success : () => 'Login Successfull',
  Error   : error => error
});


function init() {
  return pure({ name: '', password: '', status: Status.Empty() });
}


function login(state, dispatch) {
  api.login(state.name, state.password)
     .then(Action.LoginSuccess, Action.LoginError)
     .then(dispatch);
}

function update(state, action) {
  return  Action.case({
    // Input actions
    Name : name => pure({ ...state, name }),
    Password : password => pure({ ...state, password }),

    // Request actions
    Login : () => withEffects(
                    { ...state, status: Status.Pending()},
                    Effect.Login()
                  ),
    LoginSuccess : () => pure({ ...state, status: Status.Success('')  }),
    LoginError : (error) => pure({ ...state, status: Status.Error(error) })
  }, action);
}

function execute(state, effect, dispatch) {
  Effect.case({
    Login : () => login(state, dispatch)
  }, effect)
}

export default { view, init, update, Action, execute, Effect };
