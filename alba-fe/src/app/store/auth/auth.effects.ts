import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, tap } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { loginAuths, loginAuthsFailure, loginAuthsSuccess, logoutAuth } from "./auth.actions";

@Injectable ()
export class AuthEffects {

  constructor (
    private actions$: Actions
  ) { }

  readonly login$ = createEffect (
    () => this.actions$.pipe (
      ofType (loginAuths),
      switchMap (({ password, username }) => {
          return of (true)
          .pipe (
            map ((token) => {
              return loginAuthsSuccess ({ user: { name: username } });
            }),
            catchError (response => of (loginAuthsFailure ({ error: "Errore" })))
          );
        }
      )
    )
  );

  readonly logout$ = createEffect (
    () => this.actions$.pipe (
      ofType (logoutAuth),
      tap (() => {
        window.location.reload()
      })
    ), { dispatch: false }
  );

} // AuthEffects
