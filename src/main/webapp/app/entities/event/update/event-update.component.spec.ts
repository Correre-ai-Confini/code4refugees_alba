import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventService } from '../service/event.service';
import { IEvent, Event } from '../event.model';
import { IEventType } from 'app/entities/event-type/event-type.model';
import { EventTypeService } from 'app/entities/event-type/service/event-type.service';
import { ICheckPoint } from 'app/entities/check-point/check-point.model';
import { CheckPointService } from 'app/entities/check-point/service/check-point.service';
import { IOperator } from 'app/entities/operator/operator.model';
import { OperatorService } from 'app/entities/operator/service/operator.service';
import { IRegistration } from 'app/entities/registration/registration.model';
import { RegistrationService } from 'app/entities/registration/service/registration.service';

import { EventUpdateComponent } from './event-update.component';

describe('Event Management Update Component', () => {
  let comp: EventUpdateComponent;
  let fixture: ComponentFixture<EventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventService: EventService;
  let eventTypeService: EventTypeService;
  let checkPointService: CheckPointService;
  let operatorService: OperatorService;
  let registrationService: RegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EventUpdateComponent],
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
      .overrideTemplate(EventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventService = TestBed.inject(EventService);
    eventTypeService = TestBed.inject(EventTypeService);
    checkPointService = TestBed.inject(CheckPointService);
    operatorService = TestBed.inject(OperatorService);
    registrationService = TestBed.inject(RegistrationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call category query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const category: IEventType = { id: 15975 };
      event.category = category;

      const categoryCollection: IEventType[] = [{ id: 37790 }];
      jest.spyOn(eventTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const expectedCollection: IEventType[] = [category, ...categoryCollection];
      jest.spyOn(eventTypeService, 'addEventTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(eventTypeService.query).toHaveBeenCalled();
      expect(eventTypeService.addEventTypeToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, category);
      expect(comp.categoriesCollection).toEqual(expectedCollection);
    });

    it('Should call checkPoint query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const checkPoint: ICheckPoint = { id: 25287 };
      event.checkPoint = checkPoint;

      const checkPointCollection: ICheckPoint[] = [{ id: 44503 }];
      jest.spyOn(checkPointService, 'query').mockReturnValue(of(new HttpResponse({ body: checkPointCollection })));
      const expectedCollection: ICheckPoint[] = [checkPoint, ...checkPointCollection];
      jest.spyOn(checkPointService, 'addCheckPointToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(checkPointService.query).toHaveBeenCalled();
      expect(checkPointService.addCheckPointToCollectionIfMissing).toHaveBeenCalledWith(checkPointCollection, checkPoint);
      expect(comp.checkPointsCollection).toEqual(expectedCollection);
    });

    it('Should call operator query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const operator: IOperator = { id: 26947 };
      event.operator = operator;

      const operatorCollection: IOperator[] = [{ id: 31086 }];
      jest.spyOn(operatorService, 'query').mockReturnValue(of(new HttpResponse({ body: operatorCollection })));
      const expectedCollection: IOperator[] = [operator, ...operatorCollection];
      jest.spyOn(operatorService, 'addOperatorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(operatorService.query).toHaveBeenCalled();
      expect(operatorService.addOperatorToCollectionIfMissing).toHaveBeenCalledWith(operatorCollection, operator);
      expect(comp.operatorsCollection).toEqual(expectedCollection);
    });

    it('Should call Registration query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const registration: IRegistration = { id: 8932 };
      event.registration = registration;

      const registrationCollection: IRegistration[] = [{ id: 99985 }];
      jest.spyOn(registrationService, 'query').mockReturnValue(of(new HttpResponse({ body: registrationCollection })));
      const additionalRegistrations = [registration];
      const expectedCollection: IRegistration[] = [...additionalRegistrations, ...registrationCollection];
      jest.spyOn(registrationService, 'addRegistrationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(registrationService.query).toHaveBeenCalled();
      expect(registrationService.addRegistrationToCollectionIfMissing).toHaveBeenCalledWith(
        registrationCollection,
        ...additionalRegistrations
      );
      expect(comp.registrationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const event: IEvent = { id: 456 };
      const category: IEventType = { id: 82567 };
      event.category = category;
      const checkPoint: ICheckPoint = { id: 80592 };
      event.checkPoint = checkPoint;
      const operator: IOperator = { id: 92769 };
      event.operator = operator;
      const registration: IRegistration = { id: 76154 };
      event.registration = registration;

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(event));
      expect(comp.categoriesCollection).toContain(category);
      expect(comp.checkPointsCollection).toContain(checkPoint);
      expect(comp.operatorsCollection).toContain(operator);
      expect(comp.registrationsSharedCollection).toContain(registration);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Event>>();
      const event = { id: 123 };
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventService.update).toHaveBeenCalledWith(event);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Event>>();
      const event = new Event();
      jest.spyOn(eventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(eventService.create).toHaveBeenCalledWith(event);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Event>>();
      const event = { id: 123 };
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventService.update).toHaveBeenCalledWith(event);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEventTypeById', () => {
      it('Should return tracked EventType primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventTypeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCheckPointById', () => {
      it('Should return tracked CheckPoint primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCheckPointById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackOperatorById', () => {
      it('Should return tracked Operator primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOperatorById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackRegistrationById', () => {
      it('Should return tracked Registration primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRegistrationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
