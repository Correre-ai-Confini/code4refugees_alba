import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OperatorService } from '../service/operator.service';

import { OperatorComponent } from './operator.component';

describe('Operator Management Component', () => {
  let comp: OperatorComponent;
  let fixture: ComponentFixture<OperatorComponent>;
  let service: OperatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OperatorComponent],
    })
      .overrideTemplate(OperatorComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OperatorComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OperatorService);

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
    expect(comp.operators?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
