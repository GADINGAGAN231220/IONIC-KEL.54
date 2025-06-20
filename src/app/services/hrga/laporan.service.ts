// src/app/services/hrga/laporan.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Interface untuk struktur data paginasi dari Laravel
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Interface untuk Laporan Harian
export interface LaporanHarian {
  id: number;
  tanggal: string;
  jumlah_pesanan: number;
  jumlah_diambil: number;
  sisa_tidak_diambil: number;
  shift: { nama_shift: string };
  pesanan_makanan: {
    vendor: { nama_vendor: string };
  };
}

// Interface untuk Laporan Bulanan
export interface LaporanBulanan {
  id: number;
  bulan: number;
  tahun: number;
  total_porsi_dipesan: number;
  total_porsi_terdistribusi: number;
  total_sisa_porsi: number;
  total_biaya: string; // Biaya bisa jadi string karena format dari backend
  vendor: {
    nama_vendor: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LaporanService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Mengambil data Laporan Harian dengan filter dan paginasi
   */
  getLaporanHarian(page: number, tanggal?: string): Observable<PaginatedResponse<LaporanHarian>> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('Token tidak ditemukan.');

        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        let params = new HttpParams().set('page', page.toString());
        if (tanggal) {
          params = params.set('tanggal', tanggal);
        }

        return this.http.get<PaginatedResponse<LaporanHarian>>(`${this.apiUrl}/hrga/laporan/harian`, { headers, params });
      })
    );
  }

  /**
   * Mengambil data Laporan Bulanan dengan filter dan paginasi
   */
  getLaporanBulanan(page: number, bulan?: number, tahun?: number): Observable<PaginatedResponse<LaporanBulanan>> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('Token tidak ditemukan.');

        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        let params = new HttpParams().set('page', page.toString());
        if (bulan) {
          params = params.set('bulan', bulan.toString());
        }
        if (tahun) {
          params = params.set('tahun', tahun.toString());
        }

        return this.http.get<PaginatedResponse<LaporanBulanan>>(`${this.apiUrl}/hrga/laporan/bulanan`, { headers, params });
      })
    );
  }
}
