import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MedicalSurveyService } from '../service/medical-survey.service';

import { MedicalSurveyComponent } from './medical-survey.component';

describe('MedicalSurvey Management Component', () => {
  let comp: MedicalSurveyComponent;
  let fixture: ComponentFixture<MedicalSurveyComponent>;
  let service: MedicalSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MedicalSurveyComponent],
    })
      .overrideTemplate(MedicalSurveyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicalSurveyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MedicalSurveyService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.medicalSurveys?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
