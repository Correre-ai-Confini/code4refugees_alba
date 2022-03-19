import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OperatorComponent } from '../list/operator.component';
import { OperatorDetailComponent } from '../detail/operator-detail.component';
import { OperatorUpdateComponent } from '../update/operator-update.component';
import { OperatorRoutingResolveService } from './operator-routing-resolve.service';

const operatorRoute: Routes = [
  {
    path: '',
    component: OperatorComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OperatorDetailComponent,
    resolve: {
      operator: OperatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OperatorUpdateComponent,
    resolve: {
      operator: OperatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OperatorUpdateComponent,
    resolve: {
      operator: OperatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(operatorRoute)],
  exports: [RouterModule],
})
export class OperatorRoutingModule {}
