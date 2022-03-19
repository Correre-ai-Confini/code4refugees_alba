import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, tap } from "rxjs";

import { State } from '../store';
import { loginAuths, logoutAuth } from "../store/auth/auth.actions";
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private store: Store<State>,) { }

  isAuthenticated$(): Observable<boolean> { return this.store.pipe(select(selectIsAuthenticated)).pipe(
    tap(a => console.log(a))
  ); }

  public login(loginData: { username: string, password: string }) {
    this.store.dispatch(loginAuths({ password: loginData.password, username: loginData.username }))
  }
  logout () {
    this.store.dispatch(logoutAuth())
  }
}
