import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LaporanPageRoutingModule } from './laporan-routing.module';
import { LaporanPage } from './laporan.page';
// Impor pipe dari file-nya
import { MonthNamePipe } from './month-name.pipe'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaporanPageRoutingModule,
    MonthNamePipe // <-- Pindahkan pipe ke dalam array 'imports'
  ],
  // Hapus pipe dari array 'declarations'
  declarations: [LaporanPage]
})
export class LaporanPageModule {}
