import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  user: User | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let user = await this.authService.getUser();
    
    // Cek jika 'karyawan' adalah array dan ambil elemen pertamanya
    if (user && Array.isArray(user.karyawan) && user.karyawan.length > 0) {
      user.karyawan = user.karyawan[0];
    }
    
    this.user = user;
  }

  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { // Menggunakan format Indonesia
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getRoleNames(): string {
    return this.user?.roles.map(role => role.name).join(', ') || 'No roles';
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}

// Interfaces untuk tipe data yang lebih aman
interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface Karyawan {
    id: number;
    user_id: number;
    divisi_id: number;
    shift_id: number;
    nip: string;
    nama_lengkap: string;
    email: string;
    phone: string;
    status_kerja: string;
    tanggal_bergabung: string;
    berhak_konsumsi: boolean;
    created_at: string;
    updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  karyawan: Karyawan | null; // Tipe diubah menjadi objek Karyawan
}