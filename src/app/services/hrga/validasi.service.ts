// src/app/services/hrga/validasi.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Interface untuk data pesanan yang akan divalidasi
export interface PesananUntukValidasi {
  id: number;
  tanggal_pesanan: string;
  jumlah_pesanan: number;
  menu: string;
  status: string;
  vendor: {
    nama_vendor: string;
  };
  shift: {
    nama_shift: string;
  }
}

// Interface untuk payload yang akan dikirim
export interface ValidasiFisikPayload {
  pesanan_makanan_id: number;
  jumlah_fisik_diterima: number;
  jumlah_rusak: number;
  kondisi: 'baik' | 'rusak';
  catatan_validasi?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidasiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Mengambil daftar pesanan yang perlu divalidasi
   */
  getPesananUntukValidasi(): Observable<PesananUntukValidasi[]> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('Token otorisasi tidak ditemukan.');

        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<PesananUntukValidasi[]>(`${this.apiUrl}/hrga/validasi/pesanan-list`, { headers });
      })
    );
  }

  /**
   * Mengirim data hasil validasi fisik
   * @param payload Data dari form validasi
   */
  submitValidasiFisik(payload: ValidasiFisikPayload): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('Token otorisasi tidak ditemukan.');
        
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.post(`${this.apiUrl}/hrga/validasi/fisik`, payload, { headers });
      })
    );
  }
}
