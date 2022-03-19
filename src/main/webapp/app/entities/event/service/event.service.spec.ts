import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { TreatmentPriority } from 'app/entities/enumerations/treatment-priority.model';
import { IEvent, Event } from '../event.model';

import { EventService } from './event.service';

describe('Event Service', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  let elemDefault: IEvent;
  let expectedResult: IEvent | IEvent[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      notes: 'AAAAAAA',
      timestamp: currentDate,
      urgencyOfMedicalTreatment: TreatmentPriority.BLACK,
      needForLegalAssistance: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Event', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.create(new Event()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Event', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          notes: 'BBBBBB',
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          urgencyOfMedicalTreatment: 'BBBBBB',
          needForLegalAssistance: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Event', () => {
      const patchObject = Object.assign(
        {
          notes: 'BBBBBB',
          needForLegalAssistance: 1,
        },
        new Event()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Event', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          notes: 'BBBBBB',
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          urgencyOfMedicalTreatment: 'BBBBBB',
          needForLegalAssistance: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Event', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventToCollectionIfMissing', () => {
      it('should add a Event to an empty array', () => {
        const event: IEvent = { id: 123 };
        expectedResult = service.addEventToCollectionIfMissing([], event);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(event);
      });

      it('should not add a Event to an array that contains it', () => {
        const event: IEvent = { id: 123 };
        const eventCollection: IEvent[] = [
          {
            ...event,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventToCollectionIfMissing(eventCollection, event);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Event to an array that doesn't contain it", () => {
        const event: IEvent = { id: 123 };
        const eventCollection: IEvent[] = [{ id: 456 }];
        expectedResult = service.addEventToCollectionIfMissing(eventCollection, event);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(event);
      });

      it('should add only unique Event to an array', () => {
        const eventArray: IEvent[] = [{ id: 123 }, { id: 456 }, { id: 59584 }];
        const eventCollection: IEvent[] = [{ id: 123 }];
        expectedResult = service.addEventToCollectionIfMissing(eventCollection, ...eventArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const event: IEvent = { id: 123 };
        const event2: IEvent = { id: 456 };
        expectedResult = service.addEventToCollectionIfMissing([], event, event2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(event);
        expect(expectedResult).toContain(event2);
      });

      it('should accept null and undefined values', () => {
        const event: IEvent = { id: 123 };
        expectedResult = service.addEventToCollectionIfMissing([], null, event, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(event);
      });

      it('should return initial array if no Event is added', () => {
        const eventCollection: IEvent[] = [{ id: 123 }];
        expectedResult = service.addEventToCollectionIfMissing(eventCollection, undefined, null);
        expect(expectedResult).toEqual(eventCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
