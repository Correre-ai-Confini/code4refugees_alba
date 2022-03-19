import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OperatorService } from '../service/operator.service';
import { IOperator, Operator } from '../operator.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';

import { OperatorUpdateComponent } from './operator-update.component';

describe('Operator Management Update Component', () => {
  let comp: OperatorUpdateComponent;
  let fixture: ComponentFixture<OperatorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let operatorService: OperatorService;
  let personService: PersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OperatorUpdateComponent],
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
      .overrideTemplate(OperatorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OperatorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    operatorService = TestBed.inject(OperatorService);
    personService = TestBed.inject(PersonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call personalInformation query and add missing value', () => {
      const operator: IOperator = { id: 456 };
      const personalInformation: IPerson = { id: 99574 };
      operator.personalInformation = personalInformation;

      const personalInformationCollection: IPerson[] = [{ id: 16910 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personalInformationCollection })));
      const expectedCollection: IPerson[] = [personalInformation, ...personalInformationCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ operator });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personalInformationCollection, personalInformation);
      expect(comp.personalInformationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const operator: IOperator = { id: 456 };
      const personalInformation: IPerson = { id: 22998 };
      operator.personalInformation = personalInformation;

      activatedRoute.data = of({ operator });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(operator));
      expect(comp.personalInformationsCollection).toContain(personalInformation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Operator>>();
      const operator = { id: 123 };
      jest.spyOn(operatorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operator }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(operatorService.update).toHaveBeenCalledWith(operator);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Operator>>();
      const operator = new Operator();
      jest.spyOn(operatorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operator }));
      saveSubject.complete();

      // THEN
      expect(operatorService.create).toHaveBeenCalledWith(operator);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Operator>>();
      const operator = { id: 123 };
      jest.spyOn(operatorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(operatorService.update).toHaveBeenCalledWith(operator);
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
  });
});
