import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRefugee } from '../refugee.model';
import { RefugeeService } from '../service/refugee.service';
import { RefugeeDeleteDialogComponent } from '../delete/refugee-delete-dialog.component';

@Component({
  selector: 'jhi-refugee',
  templateUrl: './refugee.component.html',
})
export class RefugeeComponent implements OnInit {
  refugees?: IRefugee[];
  isLoading = false;

  constructor(protected refugeeService: RefugeeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.refugeeService.query().subscribe({
      next: (res: HttpResponse<IRefugee[]>) => {
        this.isLoading = false;
        this.refugees = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRefugee): number {
    return item.id!;
  }

  delete(refugee: IRefugee): void {
    const modalRef = this.modalService.open(RefugeeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.refugee = refugee;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
