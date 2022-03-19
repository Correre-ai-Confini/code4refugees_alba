import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AttachmentCategoryService } from '../service/attachment-category.service';
import { IAttachmentCategory, AttachmentCategory } from '../attachment-category.model';

import { AttachmentCategoryUpdateComponent } from './attachment-category-update.component';

describe('AttachmentCategory Management Update Component', () => {
  let comp: AttachmentCategoryUpdateComponent;
  let fixture: ComponentFixture<AttachmentCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attachmentCategoryService: AttachmentCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AttachmentCategoryUpdateComponent],
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
      .overrideTemplate(AttachmentCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttachmentCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attachmentCategoryService = TestBed.inject(AttachmentCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const attachmentCategory: IAttachmentCategory = { id: 456 };

      activatedRoute.data = of({ attachmentCategory });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(attachmentCategory));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AttachmentCategory>>();
      const attachmentCategory = { id: 123 };
      jest.spyOn(attachmentCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachmentCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attachmentCategory }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(attachmentCategoryService.update).toHaveBeenCalledWith(attachmentCategory);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AttachmentCategory>>();
      const attachmentCategory = new AttachmentCategory();
      jest.spyOn(attachmentCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachmentCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attachmentCategory }));
      saveSubject.complete();

      // THEN
      expect(attachmentCategoryService.create).toHaveBeenCalledWith(attachmentCategory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AttachmentCategory>>();
      const attachmentCategory = { id: 123 };
      jest.spyOn(attachmentCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachmentCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attachmentCategoryService.update).toHaveBeenCalledWith(attachmentCategory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
