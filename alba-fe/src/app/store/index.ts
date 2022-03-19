import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../environments/environment';
import { authReducer, AuthState } from './auth/auth.reducer';

export interface State {
  auth: AuthState,
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
