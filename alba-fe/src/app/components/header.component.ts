import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector:"alba-header",
  template: `
    <mat-toolbar color="primary" class="flex">
    <span>
      <button mat-button routerLink="/">ALBA</button>
    </span>
        <div class="flex-1 flex flex-row justify-end">
          <ng-container *ngIf="isAuthenticated else notAuthenticated">
            <button mat-button (click)="logout.next()">
              <mat-icon>exit_to_app</mat-icon>
              Logout
            </button>
          </ng-container>
        </div>
        <ng-template #notAuthenticated>
          <a mat-button [routerLink]="'login'" >
            <mat-icon>exit_to_app</mat-icon>
            Login
          </a>
        </ng-template>
      </mat-toolbar>
  `,
  styles: [`  `],

})
export class HeaderComponent {
  constructor () {}
  @Input() isAuthenticated!: boolean;
  @Output() logout = new EventEmitter<void> ();
}
