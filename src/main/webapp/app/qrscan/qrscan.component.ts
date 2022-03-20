import { Component } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

interface QRScan {
  uuid: string;
}
@Component({
  selector: 'qrscan',
  templateUrl: './qrscan.component.html',
  styleUrls: ['./qrscan.component.scss']
})
export class QrScanComponent {

  scannedQr: string = ''
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX ];
  scannerEnabled: boolean = true;

  constructor() {}

  public scanSuccessHandler($event: string) {
    this.scannedQr = $event;
    const qr: QRScan = { uuid: $event };
    console.log(qr);
    this.scannerEnabled = false;
  }

  public enableScanner() {
    this.scannedQr = '';
    this.scannerEnabled = true;
  }

}
