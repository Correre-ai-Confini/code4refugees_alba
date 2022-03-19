import { Action, createReducer, on } from "@ngrx/store";

import { loginAuths, loginAuthsFailure, loginAuthsSuccess } from './auth.actions';


export const authFeatureKey = 'auth';

export interface user {

}

export interface AuthState {
  isAuthenticated: boolean
  pending: boolean,
  user?: {
    name: string
  }
}

export const initialState: AuthState = {
  isAuthenticated: false,
  pending: false,
};

const reducer = createReducer<AuthState> (
  initialState,
  on (loginAuths, state => ({ ...state, pending: true })),
  on (loginAuthsFailure, state => ({ ...state, pending: true, isAuthenticated: false })),
  on (loginAuthsSuccess, (state, action) => ({ ...state, pending: false, isAuthenticated: true, user: action.user })),
);

export function authReducer (state: AuthState | undefined, action: Action): AuthState {
  return reducer (state, action);
} // authReducer
