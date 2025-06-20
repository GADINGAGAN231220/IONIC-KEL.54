// src/app/services/hrga/dashboard.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Import AuthService
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs'; // <-- Tambahkan 'from'
import { switchMap } from 'rxjs/operators';


// Definisikan interface agar tipe data lebih jelas
export interface DashboardSummary {
  total_karyawan_aktif: number;
  total_vendor_aktif: number;
  pesanan_hari_ini: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  // Fungsi untuk mengambil ringkasan data dashboard
 getDashboardSummary(): Observable<DashboardSummary> {
    // 1. Ubah Promise dari getToken() menjadi Observable menggunakan 'from'.
    return from(this.authService.getToken()).pipe(
      // 2. Gunakan switchMap untuk beralih ke Observable HTTP setelah token didapat.
      switchMap(token => {
        if (!token) {
          // Jika token tidak ada, lempar error.
          throw new Error('Token otorisasi tidak ditemukan.');
        }

        // 3. Siapkan header dengan token yang sudah pasti ada.
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // 4. Lakukan request GET ke endpoint dashboard.
        return this.http.get<DashboardSummary>(`${this.apiUrl}/hrga/dashboard-summary`, { headers });
      })
    );
  }

}