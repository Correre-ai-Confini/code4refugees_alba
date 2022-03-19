import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LegalSurveyComponent } from '../list/legal-survey.component';
import { LegalSurveyDetailComponent } from '../detail/legal-survey-detail.component';
import { LegalSurveyUpdateComponent } from '../update/legal-survey-update.component';
import { LegalSurveyRoutingResolveService } from './legal-survey-routing-resolve.service';

const legalSurveyRoute: Routes = [
  {
    path: '',
    component: LegalSurveyComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LegalSurveyDetailComponent,
    resolve: {
      legalSurvey: LegalSurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LegalSurveyUpdateComponent,
    resolve: {
      legalSurvey: LegalSurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LegalSurveyUpdateComponent,
    resolve: {
      legalSurvey: LegalSurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(legalSurveyRoute)],
  exports: [RouterModule],
})
export class LegalSurveyRoutingModule {}
