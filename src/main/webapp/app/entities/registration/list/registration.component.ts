import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistration } from '../registration.model';
import { RegistrationService } from '../service/registration.service';
import { RegistrationDeleteDialogComponent } from '../delete/registration-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-registration',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent implements OnInit {
  registrations?: IRegistration[];
  isLoading = false;

  constructor(protected registrationService: RegistrationService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.registrationService.query().subscribe({
      next: (res: HttpResponse<IRegistration[]>) => {
        this.isLoading = false;
        this.registrations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRegistration): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(registration: IRegistration): void {
    const modalRef = this.modalService.open(RegistrationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.registration = registration;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
