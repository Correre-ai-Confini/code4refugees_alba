import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RegistrationComponent } from '../list/registration.component';
import { RegistrationDetailComponent } from '../detail/registration-detail.component';
import { RegistrationUpdateComponent } from '../update/registration-update.component';
import { RegistrationRoutingResolveService } from './registration-routing-resolve.service';

const registrationRoute: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RegistrationDetailComponent,
    resolve: {
      registration: RegistrationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RegistrationUpdateComponent,
    resolve: {
      registration: RegistrationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RegistrationUpdateComponent,
    resolve: {
      registration: RegistrationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(registrationRoute)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}
