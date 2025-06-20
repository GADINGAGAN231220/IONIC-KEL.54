// src/app/hrga/pesanan/pesanan.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PesananService, Vendor, Shift } from '../../services/hrga/pesanan.service';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-pesanan',
  templateUrl: './pesanan.page.html',
  styleUrls: ['./pesanan.page.scss'],
  standalone: false
})
export class PesananPage implements OnInit {
  
  pesananForm: FormGroup;
  vendors: Vendor[] = [];
  shifts: Shift[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  today = new Date().toISOString(); // Untuk membatasi tanggal minimum

  constructor(
    private fb: FormBuilder,
    private pesananService: PesananService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    // Inisialisasi form dengan FormBuilder
    this.pesananForm = this.fb.group({
      vendor_id: [null, [Validators.required]],
      shift_id: [null, [Validators.required]],
      tanggal_pesanan: [null, [Validators.required]],
      jumlah_porsi_dipesan: [null, [Validators.required, Validators.min(1)]],
      menu: ['', [Validators.required, Validators.minLength(3)]],
      keterangan: ['']
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;
    this.errorMessage = null;

    this.pesananService.getFormData().subscribe({
      next: (data) => {
        this.vendors = data.vendors;
        this.shifts = data.shifts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Gagal memuat data form:', err);
        this.errorMessage = 'Gagal memuat data master. Silakan coba lagi.';
        this.isLoading = false;
      }
    });
  }

  // Fungsi untuk format tanggal sebelum dikirim
  formatDate(value: string) {
    return format(parseISO(value), 'yyyy-MM-dd');
  }

  async submitPesanan() {
    if (this.pesananForm.invalid) {
      this.presentToast('Harap isi semua kolom yang wajib diisi dengan benar.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Mengirim pesanan...' });
    await loading.present();
    
    // Ambil nilai dari form dan format tanggalnya
    const formValue = this.pesananForm.value;
    const payload = {
      ...formValue,
      tanggal_pesanan: this.formatDate(formValue.tanggal_pesanan)
    };

    this.pesananService.createPesanan(payload).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.presentAlert('Berhasil', 'Pesanan makanan baru telah berhasil dibuat.');
        this.pesananForm.reset(); // Reset form setelah berhasil
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error saat membuat pesanan:', err);
        // Menampilkan error validasi dari Laravel jika ada
        const errorMsg = err.error?.message || 'Terjadi kesalahan saat mengirim data.';
        this.presentAlert('Gagal', errorMsg);
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
