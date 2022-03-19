import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAttachmentCategory, AttachmentCategory } from '../attachment-category.model';

import { AttachmentCategoryService } from './attachment-category.service';

describe('AttachmentCategory Service', () => {
  let service: AttachmentCategoryService;
  let httpMock: HttpTestingController;
  let elemDefault: IAttachmentCategory;
  let expectedResult: IAttachmentCategory | IAttachmentCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AttachmentCategoryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      description: 'AAAAAAA',
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

    it('should create a AttachmentCategory', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AttachmentCategory()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AttachmentCategory', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AttachmentCategory', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
        },
        new AttachmentCategory()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AttachmentCategory', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: 'BBBBBB',
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

    it('should delete a AttachmentCategory', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAttachmentCategoryToCollectionIfMissing', () => {
      it('should add a AttachmentCategory to an empty array', () => {
        const attachmentCategory: IAttachmentCategory = { id: 123 };
        expectedResult = service.addAttachmentCategoryToCollectionIfMissing([], attachmentCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attachmentCategory);
      });

      it('should not add a AttachmentCategory to an array that contains it', () => {
        const attachmentCategory: IAttachmentCategory = { id: 123 };
        const attachmentCategoryCollection: IAttachmentCategory[] = [
          {
            ...attachmentCategory,
          },
          { id: 456 },
        ];
        expectedResult = service.addAttachmentCategoryToCollectionIfMissing(attachmentCategoryCollection, attachmentCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AttachmentCategory to an array that doesn't contain it", () => {
        const attachmentCategory: IAttachmentCategory = { id: 123 };
        const attachmentCategoryCollection: IAttachmentCategory[] = [{ id: 456 }];
        expectedResult = service.addAttachmentCategoryToCollectionIfMissing(attachmentCategoryCollection, attachmentCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attachmentCategory);
      });

      it('should add only unique AttachmentCategory to an array', () => {
        const attachmentCategoryArray: IAttachmentCategory[] = [{ id: 123 }, { id: 456 }, { id: 29453 }];
        const attachmentCategoryCollection: IAttachmentCategory[] = [{ id: 123 }];
        expectedResult = service.addAttachmentCategoryToCollectionIfMissing(attachmentCategoryCollection, ...attachmentCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const attachmentCategory: IAttachmentCategory = { id: 123 };
        const attachmentCategory2: IAttachmentCategory = { id: 456 };
        expectedResult = service.addAttachmentCategoryToCollectionIfMissing([], attachmentCategory, attachmentCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attachmentCategory);
        expect(expectedResult).toContain(attachmentCategory2);
      });

      it('should accept null and undefined values', () => {
        const attachmentCategory: IAttachmentCategory = { id: 123 };
        expectedResult = service.addAttachmentCategoryToCollectionIfMissing([], null, attachmentCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attachmentCategory);
      });

      it('should return initial array if no AttachmentCategory is added', () => {
        const attachmentCategoryCollection: IAttachmentCategory[] = [{ id: 123 }];
        expectedResult = service.addAttachmentCategoryToCollectionIfMissing(attachmentCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(attachmentCategoryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
