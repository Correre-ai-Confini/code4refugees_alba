import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RefugeeService } from '../service/refugee.service';
import { IRefugee, Refugee } from '../refugee.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { ILegalSurvey } from 'app/entities/legal-survey/legal-survey.model';
import { LegalSurveyService } from 'app/entities/legal-survey/service/legal-survey.service';
import { IMedicalSurvey } from 'app/entities/medical-survey/medical-survey.model';
import { MedicalSurveyService } from 'app/entities/medical-survey/service/medical-survey.service';

import { RefugeeUpdateComponent } from './refugee-update.component';

describe('Refugee Management Update Component', () => {
  let comp: RefugeeUpdateComponent;
  let fixture: ComponentFixture<RefugeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let refugeeService: RefugeeService;
  let personService: PersonService;
  let jobService: JobService;
  let legalSurveyService: LegalSurveyService;
  let medicalSurveyService: MedicalSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RefugeeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RefugeeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RefugeeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    refugeeService = TestBed.inject(RefugeeService);
    personService = TestBed.inject(PersonService);
    jobService = TestBed.inject(JobService);
    legalSurveyService = TestBed.inject(LegalSurveyService);
    medicalSurveyService = TestBed.inject(MedicalSurveyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call personalInformation query and add missing value', () => {
      const refugee: IRefugee = { id: 456 };
      const personalInformation: IPerson = { id: 36437 };
      refugee.personalInformation = personalInformation;

      const personalInformationCollection: IPerson[] = [{ id: 97419 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personalInformationCollection })));
      const expectedCollection: IPerson[] = [personalInformation, ...personalInformationCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ refugee });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personalInformationCollection, personalInformation);
      expect(comp.personalInformationsCollection).toEqual(expectedCollection);
    });

    it('Should call Job query and add missing value', () => {
      const refugee: IRefugee = { id: 456 };
      const primaryOccupation: IJob = { id: 93357 };
      refugee.primaryOccupation = primaryOccupation;

      const jobCollection: IJob[] = [{ id: 59938 }];
      jest.spyOn(jobService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCollection })));
      const additionalJobs = [primaryOccupation];
      const expectedCollection: IJob[] = [...additionalJobs, ...jobCollection];
      jest.spyOn(jobService, 'addJobToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ refugee });
      comp.ngOnInit();

      expect(jobService.query).toHaveBeenCalled();
      expect(jobService.addJobToCollectionIfMissing).toHaveBeenCalledWith(jobCollection, ...additionalJobs);
      expect(comp.jobsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LegalSurvey query and add missing value', () => {
      const refugee: IRefugee = { id: 456 };
      const legalSurvey: ILegalSurvey = { id: 50873 };
      refugee.legalSurvey = legalSurvey;

      const legalSurveyCollection: ILegalSurvey[] = [{ id: 30016 }];
      jest.spyOn(legalSurveyService, 'query').mockReturnValue(of(new HttpResponse({ body: legalSurveyCollection })));
      const additionalLegalSurveys = [legalSurvey];
      const expectedCollection: ILegalSurvey[] = [...additionalLegalSurveys, ...legalSurveyCollection];
      jest.spyOn(legalSurveyService, 'addLegalSurveyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ refugee });
      comp.ngOnInit();

      expect(legalSurveyService.query).toHaveBeenCalled();
      expect(legalSurveyService.addLegalSurveyToCollectionIfMissing).toHaveBeenCalledWith(legalSurveyCollection, ...additionalLegalSurveys);
      expect(comp.legalSurveysSharedCollection).toEqual(expectedCollection);
    });

    it('Should call MedicalSurvey query and add missing value', () => {
      const refugee: IRefugee = { id: 456 };
      const medicalSurvey: IMedicalSurvey = { id: 50523 };
      refugee.medicalSurvey = medicalSurvey;

      const medicalSurveyCollection: IMedicalSurvey[] = [{ id: 38699 }];
      jest.spyOn(medicalSurveyService, 'query').mockReturnValue(of(new HttpResponse({ body: medicalSurveyCollection })));
      const additionalMedicalSurveys = [medicalSurvey];
      const expectedCollection: IMedicalSurvey[] = [...additionalMedicalSurveys, ...medicalSurveyCollection];
      jest.spyOn(medicalSurveyService, 'addMedicalSurveyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ refugee });
      comp.ngOnInit();

      expect(medicalSurveyService.query).toHaveBeenCalled();
      expect(medicalSurveyService.addMedicalSurveyToCollectionIfMissing).toHaveBeenCalledWith(
        medicalSurveyCollection,
        ...additionalMedicalSurveys
      );
      expect(comp.medicalSurveysSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const refugee: IRefugee = { id: 456 };
      const personalInformation: IPerson = { id: 14673 };
      refugee.personalInformation = personalInformation;
      const primaryOccupation: IJob = { id: 53689 };
      refugee.primaryOccupation = primaryOccupation;
      const legalSurvey: ILegalSurvey = { id: 22903 };
      refugee.legalSurvey = legalSurvey;
      const medicalSurvey: IMedicalSurvey = { id: 92147 };
      refugee.medicalSurvey = medicalSurvey;

      activatedRoute.data = of({ refugee });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(refugee));
      expect(comp.personalInformationsCollection).toContain(personalInformation);
      expect(comp.jobsSharedCollection).toContain(primaryOccupation);
      expect(comp.legalSurveysSharedCollection).toContain(legalSurvey);
      expect(comp.medicalSurveysSharedCollection).toContain(medicalSurvey);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Refugee>>();
      const refugee = { id: 123 };
      jest.spyOn(refugeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refugee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: refugee }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(refugeeService.update).toHaveBeenCalledWith(refugee);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Refugee>>();
      const refugee = new Refugee();
      jest.spyOn(refugeeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refugee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: refugee }));
      saveSubject.complete();

      // THEN
      expect(refugeeService.create).toHaveBeenCalledWith(refugee);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Refugee>>();
      const refugee = { id: 123 };
      jest.spyOn(refugeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refugee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(refugeeService.update).toHaveBeenCalledWith(refugee);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPersonById', () => {
      it('Should return tracked Person primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPersonById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackJobById', () => {
      it('Should return tracked Job primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackJobById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLegalSurveyById', () => {
      it('Should return tracked LegalSurvey primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLegalSurveyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackMedicalSurveyById', () => {
      it('Should return tracked MedicalSurvey primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackMedicalSurveyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
