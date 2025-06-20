// src/app/hrga/pesanan/pesanan.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import ReactiveFormsModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { IonicModule } from '@ionic/angular';

import { PesananPageRoutingModule } from './pesanan-routing.module';

import { PesananPage } from './pesanan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PesananPageRoutingModule,
    ReactiveFormsModule // <-- Tambahkan ini
  ],
  declarations: [PesananPage]
})
export class PesananPageModule {}
