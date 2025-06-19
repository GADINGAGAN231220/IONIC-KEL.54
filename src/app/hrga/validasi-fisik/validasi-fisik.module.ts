import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidasiFisikPageRoutingModule } from './validasi-fisik-routing.module';

import { ValidasiFisikPage } from './validasi-fisik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidasiFisikPageRoutingModule
  ],
  declarations: [ValidasiFisikPage]
})
export class ValidasiFisikPageModule {}
