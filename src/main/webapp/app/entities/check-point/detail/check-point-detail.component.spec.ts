import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CheckPointDetailComponent } from './check-point-detail.component';

describe('CheckPoint Management Detail Component', () => {
  let comp: CheckPointDetailComponent;
  let fixture: ComponentFixture<CheckPointDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckPointDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ checkPoint: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CheckPointDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CheckPointDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load checkPoint on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.checkPoint).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
