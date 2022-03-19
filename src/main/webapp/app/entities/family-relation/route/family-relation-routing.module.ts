import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FamilyRelationComponent } from '../list/family-relation.component';
import { FamilyRelationDetailComponent } from '../detail/family-relation-detail.component';
import { FamilyRelationUpdateComponent } from '../update/family-relation-update.component';
import { FamilyRelationRoutingResolveService } from './family-relation-routing-resolve.service';

const familyRelationRoute: Routes = [
  {
    path: '',
    component: FamilyRelationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FamilyRelationDetailComponent,
    resolve: {
      familyRelation: FamilyRelationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FamilyRelationUpdateComponent,
    resolve: {
      familyRelation: FamilyRelationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FamilyRelationUpdateComponent,
    resolve: {
      familyRelation: FamilyRelationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(familyRelationRoute)],
  exports: [RouterModule],
})
export class FamilyRelationRoutingModule {}
