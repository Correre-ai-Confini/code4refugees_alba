import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SharedModule } from 'app/shared/shared.module';
import { QR_ROUTE } from './qrscan.route';
import { QrScanComponent } from './qrscan.component';

@NgModule({
  imports: [SharedModule, ZXingScannerModule, RouterModule.forChild([QR_ROUTE])],
  declarations: [QrScanComponent],
})
export class QrScanModule {}
