import { Route } from '@angular/router';

import { QrScanComponent } from './qrscan.component';

export const QR_ROUTE: Route = {
  path: '',
  component: QrScanComponent,
  data: {
    pageTitle: 'SCAN',
  },
};
