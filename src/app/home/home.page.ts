// src/app/home/home.page.ts (Versi Final yang Benar)

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from '../services/food.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {
  isLoading = true;
  karyawan: any = null;
  statusHariIni: any = { sudah_ambil: false };
  menuHariIni: any = { menu: null, catatan: 'Memuat menu...' };
  today = new Date();
  errorMessage: string | null = null;

  constructor(
    private foodService: FoodService,
    private authService: AuthService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.loadData();
  }

  loadData(event: any = null) {
    this.isLoading = event ? false : true;
    this.errorMessage = null;

    Promise.all([
      this.foodService.getProfilKaryawan(),
      this.foodService.getStatusKonsumsiHariIni(),
      this.foodService.getMenuHariIni(),
    ]).then(([profilRes, statusRes, menuRes]) => {
      this.karyawan = profilRes;
      this.statusHariIni = statusRes;
      this.menuHariIni = menuRes;
    }).catch(err => {
      console.error('Gagal memuat data dashboard:', err);
      if (err.status === 404) {
        this.menuHariIni = err.error;
      } else {
        this.errorMessage = "Gagal memuat data. Periksa koneksi Anda dan coba lagi.";
      }
    }).finally(() => {
      this.isLoading = false;
      if (event) {
        event.target.complete();
      }
    });
  }

  doRefresh(event: any) {
    this.loadData(event);
  }
}