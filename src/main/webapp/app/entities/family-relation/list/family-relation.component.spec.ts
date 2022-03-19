import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FamilyRelationService } from '../service/family-relation.service';

import { FamilyRelationComponent } from './family-relation.component';

describe('FamilyRelation Management Component', () => {
  let comp: FamilyRelationComponent;
  let fixture: ComponentFixture<FamilyRelationComponent>;
  let service: FamilyRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FamilyRelationComponent],
    })
      .overrideTemplate(FamilyRelationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FamilyRelationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FamilyRelationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.familyRelations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
