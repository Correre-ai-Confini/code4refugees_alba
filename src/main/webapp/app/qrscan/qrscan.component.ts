import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { RefugeeService } from 'app/entities/refugee/service/refugee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'qrscan',
  templateUrl: './qrscan.component.html',
  styleUrls: ['./qrscan.component.scss']
})
export class QrScanComponent {
  isLoading: boolean = false;
  scannedQr: string = ''
  match?: IRefugee['id'];
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX ];
  scannerEnabled: boolean = true;

  constructor(protected refugeeService: RefugeeService, private router: Router) {}

  findQR(qrcodeUUID: IRefugee['qrcodeUUID']): void {
    this.isLoading = true;
    this.refugeeService.findByUUID(qrcodeUUID!).subscribe({
      next: (res: HttpResponse<IRefugee>) => {
        const id = res.body!['id'];
        this.match = id;
        this.router.navigate([`/refugee/${id}/view`])
        this.isLoading = false;
      },
      error: () => {
        this.scannedQr = 'No match.';
        this.isLoading = false;
      },
    });
  }

  public scanSuccessHandler($event: string) {
    const qrcodeUUID: IRefugee['qrcodeUUID'] = $event;
    this.findQR(qrcodeUUID);
    this.scannerEnabled = false;
  }

  public enableScanner() {
    this.scannedQr = '';
    this.scannerEnabled = true;
  }

}
