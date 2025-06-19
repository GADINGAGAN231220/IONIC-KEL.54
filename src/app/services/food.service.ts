// src/app/services/food.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interface untuk respons API QR Code
export interface QrCodeResponse {
  qr_token: string;
  expired_at: string; // ISO 8601 string
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private _isLoggedIn = false;
  private _token: string | null = null;
  private _apiUrl: string = environment.apiUrl;

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  async init() {
    if (this._token) {
      return;
    }

    await this.storage.create();
    await this.loadInitialData();
  }

  private async loadInitialData() {
    const token = await this.storage.get('authToken');
    console.log('storage: ' + token);
    if (token) {
      this._token = token;
      this._isLoggedIn = true;
    }
  }

  private async getHeaders(): Promise<HttpHeaders> {
    await this.init(); // Pastikan token sudah dimuat
    return new HttpHeaders({
      'Authorization': `Bearer ${this._token}`,
      'Accept': 'application/json'
    });
  }

  /**
   * Menghasilkan QR Code untuk karyawan.
   */
  async getQrCode(): Promise<QrCodeResponse> {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.post<QrCodeResponse>(`${this._apiUrl}/karyawan/qr-code/generate`, {}, { headers }));
  }

  // ================================================================
  // ✱ TAMBAHAN METHOD BARU UNTUK HALAMAN HOME ✱
  // ================================================================

  /**
   * Mengambil data profil lengkap karyawan (divisi, shift, dll).
   */
  async getProfilKaryawan(): Promise<any> {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.get<any>(`${this._apiUrl}/karyawan/profil`, { headers }));
  }

  /**
   * Mengambil status konsumsi karyawan untuk hari ini.
   */
  async getStatusKonsumsiHariIni(): Promise<any> {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.get<any>(`${this._apiUrl}/karyawan/status-konsumsi-hari-ini`, { headers }));
  }

  /**
   * Mengambil menu makanan untuk shift karyawan hari ini.
   */
  async getMenuHariIni(): Promise<any> {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.get<any>(`${this._apiUrl}/karyawan/menu-hari-ini`, { headers }));
  }
}
