import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RegistrationService } from '../service/registration.service';
import { IRegistration, Registration } from '../registration.model';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { RefugeeService } from 'app/entities/refugee/service/refugee.service';

import { RegistrationUpdateComponent } from './registration-update.component';

describe('Registration Management Update Component', () => {
  let comp: RegistrationUpdateComponent;
  let fixture: ComponentFixture<RegistrationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let registrationService: RegistrationService;
  let refugeeService: RefugeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RegistrationUpdateComponent],
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
      .overrideTemplate(RegistrationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegistrationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    registrationService = TestBed.inject(RegistrationService);
    refugeeService = TestBed.inject(RefugeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call refugee query and add missing value', () => {
      const registration: IRegistration = { id: 456 };
      const refugee: IRefugee = { id: 19901 };
      registration.refugee = refugee;

      const refugeeCollection: IRefugee[] = [{ id: 91891 }];
      jest.spyOn(refugeeService, 'query').mockReturnValue(of(new HttpResponse({ body: refugeeCollection })));
      const expectedCollection: IRefugee[] = [refugee, ...refugeeCollection];
      jest.spyOn(refugeeService, 'addRefugeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ registration });
      comp.ngOnInit();

      expect(refugeeService.query).toHaveBeenCalled();
      expect(refugeeService.addRefugeeToCollectionIfMissing).toHaveBeenCalledWith(refugeeCollection, refugee);
      expect(comp.refugeesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const registration: IRegistration = { id: 456 };
      const refugee: IRefugee = { id: 21362 };
      registration.refugee = refugee;

      activatedRoute.data = of({ registration });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(registration));
      expect(comp.refugeesCollection).toContain(refugee);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Registration>>();
      const registration = { id: 123 };
      jest.spyOn(registrationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registration }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(registrationService.update).toHaveBeenCalledWith(registration);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Registration>>();
      const registration = new Registration();
      jest.spyOn(registrationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registration }));
      saveSubject.complete();

      // THEN
      expect(registrationService.create).toHaveBeenCalledWith(registration);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Registration>>();
      const registration = { id: 123 };
      jest.spyOn(registrationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(registrationService.update).toHaveBeenCalledWith(registration);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRefugeeById', () => {
      it('Should return tracked Refugee primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRefugeeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
