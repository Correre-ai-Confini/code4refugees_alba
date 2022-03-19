import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedicalSurveyComponent } from '../list/medical-survey.component';
import { MedicalSurveyDetailComponent } from '../detail/medical-survey-detail.component';
import { MedicalSurveyUpdateComponent } from '../update/medical-survey-update.component';
import { MedicalSurveyRoutingResolveService } from './medical-survey-routing-resolve.service';

const medicalSurveyRoute: Routes = [
  {
    path: '',
    component: MedicalSurveyComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedicalSurveyDetailComponent,
    resolve: {
      medicalSurvey: MedicalSurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedicalSurveyUpdateComponent,
    resolve: {
      medicalSurvey: MedicalSurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedicalSurveyUpdateComponent,
    resolve: {
      medicalSurvey: MedicalSurveyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(medicalSurveyRoute)],
  exports: [RouterModule],
})
export class MedicalSurveyRoutingModule {}
