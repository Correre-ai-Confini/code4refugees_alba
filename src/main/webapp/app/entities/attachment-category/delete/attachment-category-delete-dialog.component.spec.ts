jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AttachmentCategoryService } from '../service/attachment-category.service';

import { AttachmentCategoryDeleteDialogComponent } from './attachment-category-delete-dialog.component';

describe('AttachmentCategory Management Delete Component', () => {
  let comp: AttachmentCategoryDeleteDialogComponent;
  let fixture: ComponentFixture<AttachmentCategoryDeleteDialogComponent>;
  let service: AttachmentCategoryService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AttachmentCategoryDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(AttachmentCategoryDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AttachmentCategoryDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AttachmentCategoryService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
