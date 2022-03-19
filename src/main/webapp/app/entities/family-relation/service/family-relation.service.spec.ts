import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FamilyRelationType } from 'app/entities/enumerations/family-relation-type.model';
import { IFamilyRelation, FamilyRelation } from '../family-relation.model';

import { FamilyRelationService } from './family-relation.service';

describe('FamilyRelation Service', () => {
  let service: FamilyRelationService;
  let httpMock: HttpTestingController;
  let elemDefault: IFamilyRelation;
  let expectedResult: IFamilyRelation | IFamilyRelation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FamilyRelationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      notes: 'AAAAAAA',
      relType: FamilyRelationType.SON,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a FamilyRelation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FamilyRelation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FamilyRelation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          notes: 'BBBBBB',
          relType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FamilyRelation', () => {
      const patchObject = Object.assign({}, new FamilyRelation());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FamilyRelation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          notes: 'BBBBBB',
          relType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a FamilyRelation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFamilyRelationToCollectionIfMissing', () => {
      it('should add a FamilyRelation to an empty array', () => {
        const familyRelation: IFamilyRelation = { id: 123 };
        expectedResult = service.addFamilyRelationToCollectionIfMissing([], familyRelation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(familyRelation);
      });

      it('should not add a FamilyRelation to an array that contains it', () => {
        const familyRelation: IFamilyRelation = { id: 123 };
        const familyRelationCollection: IFamilyRelation[] = [
          {
            ...familyRelation,
          },
          { id: 456 },
        ];
        expectedResult = service.addFamilyRelationToCollectionIfMissing(familyRelationCollection, familyRelation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FamilyRelation to an array that doesn't contain it", () => {
        const familyRelation: IFamilyRelation = { id: 123 };
        const familyRelationCollection: IFamilyRelation[] = [{ id: 456 }];
        expectedResult = service.addFamilyRelationToCollectionIfMissing(familyRelationCollection, familyRelation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(familyRelation);
      });

      it('should add only unique FamilyRelation to an array', () => {
        const familyRelationArray: IFamilyRelation[] = [{ id: 123 }, { id: 456 }, { id: 87270 }];
        const familyRelationCollection: IFamilyRelation[] = [{ id: 123 }];
        expectedResult = service.addFamilyRelationToCollectionIfMissing(familyRelationCollection, ...familyRelationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const familyRelation: IFamilyRelation = { id: 123 };
        const familyRelation2: IFamilyRelation = { id: 456 };
        expectedResult = service.addFamilyRelationToCollectionIfMissing([], familyRelation, familyRelation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(familyRelation);
        expect(expectedResult).toContain(familyRelation2);
      });

      it('should accept null and undefined values', () => {
        const familyRelation: IFamilyRelation = { id: 123 };
        expectedResult = service.addFamilyRelationToCollectionIfMissing([], null, familyRelation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(familyRelation);
      });

      it('should return initial array if no FamilyRelation is added', () => {
        const familyRelationCollection: IFamilyRelation[] = [{ id: 123 }];
        expectedResult = service.addFamilyRelationToCollectionIfMissing(familyRelationCollection, undefined, null);
        expect(expectedResult).toEqual(familyRelationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
