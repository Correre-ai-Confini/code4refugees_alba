import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FamilyRelationService } from '../service/family-relation.service';
import { IFamilyRelation, FamilyRelation } from '../family-relation.model';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { RefugeeService } from 'app/entities/refugee/service/refugee.service';

import { FamilyRelationUpdateComponent } from './family-relation-update.component';

describe('FamilyRelation Management Update Component', () => {
  let comp: FamilyRelationUpdateComponent;
  let fixture: ComponentFixture<FamilyRelationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let familyRelationService: FamilyRelationService;
  let refugeeService: RefugeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FamilyRelationUpdateComponent],
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
      .overrideTemplate(FamilyRelationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FamilyRelationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    familyRelationService = TestBed.inject(FamilyRelationService);
    refugeeService = TestBed.inject(RefugeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Refugee query and add missing value', () => {
      const familyRelation: IFamilyRelation = { id: 456 };
      const refugee1: IRefugee = { id: 62759 };
      familyRelation.refugee1 = refugee1;
      const refugee2: IRefugee = { id: 74191 };
      familyRelation.refugee2 = refugee2;

      const refugeeCollection: IRefugee[] = [{ id: 66409 }];
      jest.spyOn(refugeeService, 'query').mockReturnValue(of(new HttpResponse({ body: refugeeCollection })));
      const additionalRefugees = [refugee1, refugee2];
      const expectedCollection: IRefugee[] = [...additionalRefugees, ...refugeeCollection];
      jest.spyOn(refugeeService, 'addRefugeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ familyRelation });
      comp.ngOnInit();

      expect(refugeeService.query).toHaveBeenCalled();
      expect(refugeeService.addRefugeeToCollectionIfMissing).toHaveBeenCalledWith(refugeeCollection, ...additionalRefugees);
      expect(comp.refugeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const familyRelation: IFamilyRelation = { id: 456 };
      const refugee1: IRefugee = { id: 44393 };
      familyRelation.refugee1 = refugee1;
      const refugee2: IRefugee = { id: 50508 };
      familyRelation.refugee2 = refugee2;

      activatedRoute.data = of({ familyRelation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(familyRelation));
      expect(comp.refugeesSharedCollection).toContain(refugee1);
      expect(comp.refugeesSharedCollection).toContain(refugee2);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FamilyRelation>>();
      const familyRelation = { id: 123 };
      jest.spyOn(familyRelationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familyRelation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: familyRelation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(familyRelationService.update).toHaveBeenCalledWith(familyRelation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FamilyRelation>>();
      const familyRelation = new FamilyRelation();
      jest.spyOn(familyRelationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familyRelation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: familyRelation }));
      saveSubject.complete();

      // THEN
      expect(familyRelationService.create).toHaveBeenCalledWith(familyRelation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FamilyRelation>>();
      const familyRelation = { id: 123 };
      jest.spyOn(familyRelationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familyRelation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(familyRelationService.update).toHaveBeenCalledWith(familyRelation);
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
