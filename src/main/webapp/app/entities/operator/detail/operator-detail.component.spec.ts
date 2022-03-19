import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OperatorDetailComponent } from './operator-detail.component';

describe('Operator Management Detail Component', () => {
  let comp: OperatorDetailComponent;
  let fixture: ComponentFixture<OperatorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperatorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ operator: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OperatorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OperatorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load operator on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.operator).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
