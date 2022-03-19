import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'region',
        data: { pageTitle: 'albatestApp.region.home.title' },
        loadChildren: () => import('./region/region.module').then(m => m.RegionModule),
      },
      {
        path: 'country',
        data: { pageTitle: 'albatestApp.country.home.title' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'albatestApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'check-point',
        data: { pageTitle: 'albatestApp.checkPoint.home.title' },
        loadChildren: () => import('./check-point/check-point.module').then(m => m.CheckPointModule),
      },
      {
        path: 'refugee',
        data: { pageTitle: 'albatestApp.refugee.home.title' },
        loadChildren: () => import('./refugee/refugee.module').then(m => m.RefugeeModule),
      },
      {
        path: 'operator',
        data: { pageTitle: 'albatestApp.operator.home.title' },
        loadChildren: () => import('./operator/operator.module').then(m => m.OperatorModule),
      },
      {
        path: 'event-type',
        data: { pageTitle: 'albatestApp.eventType.home.title' },
        loadChildren: () => import('./event-type/event-type.module').then(m => m.EventTypeModule),
      },
      {
        path: 'family-relation',
        data: { pageTitle: 'albatestApp.familyRelation.home.title' },
        loadChildren: () => import('./family-relation/family-relation.module').then(m => m.FamilyRelationModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'albatestApp.event.home.title' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'registration',
        data: { pageTitle: 'albatestApp.registration.home.title' },
        loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule),
      },
      {
        path: 'person',
        data: { pageTitle: 'albatestApp.person.home.title' },
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      {
        path: 'job',
        data: { pageTitle: 'albatestApp.job.home.title' },
        loadChildren: () => import('./job/job.module').then(m => m.JobModule),
      },
      {
        path: 'medical-survey',
        data: { pageTitle: 'albatestApp.medicalSurvey.home.title' },
        loadChildren: () => import('./medical-survey/medical-survey.module').then(m => m.MedicalSurveyModule),
      },
      {
        path: 'legal-survey',
        data: { pageTitle: 'albatestApp.legalSurvey.home.title' },
        loadChildren: () => import('./legal-survey/legal-survey.module').then(m => m.LegalSurveyModule),
      },
      {
        path: 'attachment',
        data: { pageTitle: 'albatestApp.attachment.home.title' },
        loadChildren: () => import('./attachment/attachment.module').then(m => m.AttachmentModule),
      },
      {
        path: 'attachment-category',
        data: { pageTitle: 'albatestApp.attachmentCategory.home.title' },
        loadChildren: () => import('./attachment-category/attachment-category.module').then(m => m.AttachmentCategoryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
