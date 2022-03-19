import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.reducer';

export const getAuthState = createFeatureSelector<AuthState>("auth");
export const selectIsAuthenticated = createSelector(getAuthState, (state: AuthState) => state?.isAuthenticated);
