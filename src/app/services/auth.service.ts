import { Injectable } from '@angular/core';
// Tambahkan BehaviorSubject
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = false;
  private _token: string | null = null;
  private _apiUrl: string = environment.apiUrl;

  // --- TAMBAHKAN INI ---
  // BehaviorSubject untuk menyimpan role, nilai awalnya null
  private userRole = new BehaviorSubject<string | null>(null);
  // Expose role sebagai Observable agar komponen lain bisa subscribe
  public userRole$: Observable<string | null> = this.userRole.asObservable();
  // --- BATAS PENAMBAHAN ---

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  async isLoggedIn(): Promise<boolean> {
    await this.init();
    return this._isLoggedIn;
  }

  async getToken(): Promise<string | null> {
    await this.init();
    return this._token;
  }

  async getUser(): Promise<any> {
    await this.init();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this._token}`
    });
    return firstValueFrom(this.http.get<any>(`${this._apiUrl}/user`, { headers }));
  }

  // Modifikasi login method untuk mendapatkan dan menyimpan role
  login(credentials: { email: string; password: string; }) {
    return this.http.post<any>(`${this._apiUrl}/login`, credentials).pipe(
      tap(async (res) => {
        if (res.token && res.user) {
          this._token = res.token;
          this._isLoggedIn = true;

          // Ekstrak role dari respons API
          const role = res.user.role; 
          // =======================================================

          // Tambahkan log ini untuk memastikan role terbaca dengan benar
          console.log('Role from API response:', role); 

          this.userRole.next(role); // Set role ke BehaviorSubject

          // Simpan token dan role ke storage
          await this.storage.set('authToken', res.token);
          await this.storage.set('userRole', role);
        }
      })
    );
  }

  async logout(): Promise<void> {
    // ... (request logout ke API jika ada) ...

    // Hapus token dan role dari storage
    await this.storage.remove('authToken');
    await this.storage.remove('userRole');

    this._token = null;
    this._isLoggedIn = false;
    this.userRole.next(null); // Reset role
    // Navigasi ke login page bisa dilakukan di komponen
  }

  // Inisialisasi storage dan load data awal
  private async init(): Promise<void> {
    if (this._token) {
      return;
    }

    await this.storage.create();
    await this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    const token = await this.storage.get('authToken');
    // --- TAMBAHKAN INI ---
    const role = await this.storage.get('userRole');
    // --- BATAS PENAMBAHAN ---

    console.log('storage token: ' + token);
    console.log('storage role: ' + role);

    if (token) {
      this._token = token;
      this._isLoggedIn = true;
      // --- TAMBAHKAN INI ---
      if (role) {
        this.userRole.next(role);
      }
      // --- BATAS PENAMBAHAN ---
    }
  }
}