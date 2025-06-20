// src/app/services/hrga/pesanan.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Interface untuk data master
export interface Vendor {
  id: number;
  nama_vendor: string;
  // tambahkan properti lain jika ada
}

export interface Shift {
  id: number;
  nama_shift: string;
  // tambahkan properti lain jika ada
}

// Interface untuk payload pesanan
export interface PesananPayload {
  vendor_id: number;
  shift_id: number;
  tanggal_pesanan: string; // Format YYYY-MM-DD
  jumlah_porsi_dipesan: number;
  menu: string;
  keterangan?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PesananService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Mengambil semua data master (vendors dan shifts) yang dibutuhkan untuk form.
   * Menggunakan forkJoin untuk menjalankan beberapa observable secara paralel.
   */
  getFormData(): Observable<{ vendors: Vendor[], shifts: Shift[] }> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        if (!token) {
          throw new Error('Token otorisasi tidak ditemukan.');
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const vendors$ = this.http.get<Vendor[]>(`${this.apiUrl}/hrga/master/vendors`, { headers });
        const shifts$ = this.http.get<Shift[]>(`${this.apiUrl}/hrga/master/shifts`, { headers });

        // forkJoin akan menunggu kedua request selesai dan mengembalikan hasilnya dalam satu objek
        return forkJoin({
          vendors: vendors$,
          shifts: shifts$
        });
      })
    );
  }

  /**
   * Mengirim data pesanan baru ke server.
   * @param payload Data pesanan dari form.
   */
  createPesanan(payload: PesananPayload): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        if (!token) {
          throw new Error('Token otorisasi tidak ditemukan.');
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        
        // POST request ke endpoint pesanan
        return this.http.post(`${this.apiUrl}/hrga/pesanan`, payload, { headers });
      })
    );
  }
}
