import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AttachmentCategoryDetailComponent } from './attachment-category-detail.component';

describe('AttachmentCategory Management Detail Component', () => {
  let comp: AttachmentCategoryDetailComponent;
  let fixture: ComponentFixture<AttachmentCategoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentCategoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ attachmentCategory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AttachmentCategoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AttachmentCategoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load attachmentCategory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.attachmentCategory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
