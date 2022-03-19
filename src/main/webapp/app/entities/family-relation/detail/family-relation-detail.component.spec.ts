import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FamilyRelationDetailComponent } from './family-relation-detail.component';

describe('FamilyRelation Management Detail Component', () => {
  let comp: FamilyRelationDetailComponent;
  let fixture: ComponentFixture<FamilyRelationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyRelationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ familyRelation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FamilyRelationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FamilyRelationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load familyRelation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.familyRelation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
