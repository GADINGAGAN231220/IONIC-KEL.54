// src/app/pipes/month-name.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {
  private monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  transform(monthNumber: number): string {
    if (monthNumber < 1 || monthNumber > 12) {
      return 'Bulan tidak valid';
    }
    return this.monthNames[monthNumber - 1];
  }
}