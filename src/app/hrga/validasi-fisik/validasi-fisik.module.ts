// src/app/hrga/validasi-fisik/validasi-fisik.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Tambahkan ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { ValidasiFisikPageRoutingModule } from './validasi-fisik-routing.module';

import { ValidasiFisikPage } from './validasi-fisik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidasiFisikPageRoutingModule,
    ReactiveFormsModule // <-- Tambahkan ini
  ],
  declarations: [ValidasiFisikPage]
})
export class ValidasiFisikPageModule {}
