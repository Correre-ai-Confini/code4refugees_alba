import { createAction, props } from '@ngrx/store';

export const loginAuths = createAction('[Auth] Login Auths', props<{ username: string, password: string }>());
export const logoutAuth = createAction('[Auth] Logout Auths');

export const loginAuthsSuccess = createAction('[Auth] Login Auths Success',props<{ user: { name: string } }>());

export const loginAuthsFailure = createAction('[Auth] Login Auths Failure',props<{ error: any }>());
