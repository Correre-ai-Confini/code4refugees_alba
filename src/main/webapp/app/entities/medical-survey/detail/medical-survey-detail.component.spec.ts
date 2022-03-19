import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MedicalSurveyDetailComponent } from './medical-survey-detail.component';

describe('MedicalSurvey Management Detail Component', () => {
  let comp: MedicalSurveyDetailComponent;
  let fixture: ComponentFixture<MedicalSurveyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalSurveyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ medicalSurvey: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MedicalSurveyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MedicalSurveyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load medicalSurvey on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.medicalSurvey).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
