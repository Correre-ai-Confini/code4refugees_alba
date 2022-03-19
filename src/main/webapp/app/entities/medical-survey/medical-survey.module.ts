import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MedicalSurveyComponent } from './list/medical-survey.component';
import { MedicalSurveyDetailComponent } from './detail/medical-survey-detail.component';
import { MedicalSurveyUpdateComponent } from './update/medical-survey-update.component';
import { MedicalSurveyDeleteDialogComponent } from './delete/medical-survey-delete-dialog.component';
import { MedicalSurveyRoutingModule } from './route/medical-survey-routing.module';

@NgModule({
  imports: [SharedModule, MedicalSurveyRoutingModule],
  declarations: [MedicalSurveyComponent, MedicalSurveyDetailComponent, MedicalSurveyUpdateComponent, MedicalSurveyDeleteDialogComponent],
  entryComponents: [MedicalSurveyDeleteDialogComponent],
})
export class MedicalSurveyModule {}
