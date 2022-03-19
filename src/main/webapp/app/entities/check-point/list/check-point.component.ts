import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICheckPoint } from '../check-point.model';
import { CheckPointService } from '../service/check-point.service';
import { CheckPointDeleteDialogComponent } from '../delete/check-point-delete-dialog.component';

@Component({
  selector: 'jhi-check-point',
  templateUrl: './check-point.component.html',
})
export class CheckPointComponent implements OnInit {
  checkPoints?: ICheckPoint[];
  isLoading = false;

  constructor(protected checkPointService: CheckPointService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.checkPointService.query().subscribe({
      next: (res: HttpResponse<ICheckPoint[]>) => {
        this.isLoading = false;
        this.checkPoints = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICheckPoint): number {
    return item.id!;
  }

  delete(checkPoint: ICheckPoint): void {
    const modalRef = this.modalService.open(CheckPointDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.checkPoint = checkPoint;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
