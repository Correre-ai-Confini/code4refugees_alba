import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventTypeDetailComponent } from './event-type-detail.component';

describe('EventType Management Detail Component', () => {
  let comp: EventTypeDetailComponent;
  let fixture: ComponentFixture<EventTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
