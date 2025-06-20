import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {
  
  private monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    // value - 1 karena array dimulai dari index 0
    return this.monthNames[value - 1] || '';
  }

}
