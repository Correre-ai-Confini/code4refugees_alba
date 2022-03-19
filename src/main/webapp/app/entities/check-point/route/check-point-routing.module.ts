import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CheckPointComponent } from '../list/check-point.component';
import { CheckPointDetailComponent } from '../detail/check-point-detail.component';
import { CheckPointUpdateComponent } from '../update/check-point-update.component';
import { CheckPointRoutingResolveService } from './check-point-routing-resolve.service';

const checkPointRoute: Routes = [
  {
    path: '',
    component: CheckPointComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CheckPointDetailComponent,
    resolve: {
      checkPoint: CheckPointRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CheckPointUpdateComponent,
    resolve: {
      checkPoint: CheckPointRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CheckPointUpdateComponent,
    resolve: {
      checkPoint: CheckPointRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(checkPointRoute)],
  exports: [RouterModule],
})
export class CheckPointRoutingModule {}
