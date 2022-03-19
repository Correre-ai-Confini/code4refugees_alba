import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RefugeeDetailComponent } from './refugee-detail.component';

describe('Refugee Management Detail Component', () => {
  let comp: RefugeeDetailComponent;
  let fixture: ComponentFixture<RefugeeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefugeeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ refugee: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RefugeeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RefugeeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load refugee on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.refugee).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
