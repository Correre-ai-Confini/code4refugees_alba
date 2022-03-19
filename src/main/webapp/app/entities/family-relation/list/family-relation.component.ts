import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFamilyRelation } from '../family-relation.model';
import { FamilyRelationService } from '../service/family-relation.service';
import { FamilyRelationDeleteDialogComponent } from '../delete/family-relation-delete-dialog.component';

@Component({
  selector: 'jhi-family-relation',
  templateUrl: './family-relation.component.html',
})
export class FamilyRelationComponent implements OnInit {
  familyRelations?: IFamilyRelation[];
  isLoading = false;

  constructor(protected familyRelationService: FamilyRelationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.familyRelationService.query().subscribe({
      next: (res: HttpResponse<IFamilyRelation[]>) => {
        this.isLoading = false;
        this.familyRelations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFamilyRelation): number {
    return item.id!;
  }

  delete(familyRelation: IFamilyRelation): void {
    const modalRef = this.modalService.open(FamilyRelationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.familyRelation = familyRelation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
