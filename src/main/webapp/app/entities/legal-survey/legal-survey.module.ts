import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LegalSurveyComponent } from './list/legal-survey.component';
import { LegalSurveyDetailComponent } from './detail/legal-survey-detail.component';
import { LegalSurveyUpdateComponent } from './update/legal-survey-update.component';
import { LegalSurveyDeleteDialogComponent } from './delete/legal-survey-delete-dialog.component';
import { LegalSurveyRoutingModule } from './route/legal-survey-routing.module';

@NgModule({
  imports: [SharedModule, LegalSurveyRoutingModule],
  declarations: [LegalSurveyComponent, LegalSurveyDetailComponent, LegalSurveyUpdateComponent, LegalSurveyDeleteDialogComponent],
  entryComponents: [LegalSurveyDeleteDialogComponent],
})
export class LegalSurveyModule {}
