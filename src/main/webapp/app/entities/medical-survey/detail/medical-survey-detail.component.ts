import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMedicalSurvey } from '../medical-survey.model';

@Component({
  selector: 'jhi-medical-survey-detail',
  templateUrl: './medical-survey-detail.component.html',
})
export class MedicalSurveyDetailComponent implements OnInit {
  medicalSurvey: IMedicalSurvey | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medicalSurvey }) => {
      this.medicalSurvey = medicalSurvey;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
