import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RefugeeComponent } from '../list/refugee.component';
import { RefugeeDetailComponent } from '../detail/refugee-detail.component';
import { RefugeeUpdateComponent } from '../update/refugee-update.component';
import { RefugeeRoutingResolveService } from './refugee-routing-resolve.service';

const refugeeRoute: Routes = [
  {
    path: '',
    component: RefugeeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RefugeeDetailComponent,
    resolve: {
      refugee: RefugeeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RefugeeUpdateComponent,
    resolve: {
      refugee: RefugeeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RefugeeUpdateComponent,
    resolve: {
      refugee: RefugeeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(refugeeRoute)],
  exports: [RouterModule],
})
export class RefugeeRoutingModule {}
