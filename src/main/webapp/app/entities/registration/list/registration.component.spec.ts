import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RegistrationService } from '../service/registration.service';

import { RegistrationComponent } from './registration.component';

describe('Registration Management Component', () => {
  let comp: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let service: RegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RegistrationComponent],
    })
      .overrideTemplate(RegistrationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RegistrationService);

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
    expect(comp.registrations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
