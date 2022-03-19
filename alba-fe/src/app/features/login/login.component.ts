import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validator, ValidatorFn, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  template: `
      <mat-card >
      <mat-card-title>Login</mat-card-title>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <mat-form-field>
              <input type="text" matInput placeholder="Username" formControlName="username">
            </mat-form-field>
          </p>

          <p class="">
            <mat-form-field >
              <input type="password" matInput placeholder="Password" formControlName="password">
            </mat-form-field>
          </p>

          <p *ngIf="error" class="error">
            {{ error }}
          </p>

          <div class="button">
            <button type="submit" mat-button>Login</button>
          </div>

        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        margin: 100px 0px;
      }

      .mat-form-field {
        width: 100%;
        min-width: 300px;
      }

      mat-card-title,
      mat-card-content {
        display: flex;
        justify-content: center;
      }

      .error {
        padding: 16px;
        width: 300px;
        color: white;
        background-color: red;
      }

      .button {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],

})
export class LoginComponent {
  constructor (private authService: AuthService) {}

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  submit() {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    }
  }
  @Input() error: string | null | undefined;

}
