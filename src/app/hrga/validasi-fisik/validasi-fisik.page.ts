// src/app/hrga/validasi-fisik/validasi-fisik.page.ts

import { Component, OnInit } from '@angular/core';
import { ValidasiService, PesananUntukValidasi } from '../../services/hrga/validasi.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-validasi-fisik',
  templateUrl: './validasi-fisik.page.html',
  styleUrls: ['./validasi-fisik.page.scss'],
  standalone: false
})
export class ValidasiFisikPage implements OnInit {

  pesananList: PesananUntukValidasi[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private validasiService: ValidasiService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadPesanan();
  }

  async loadPesanan(event?: any) {
    if (!event) {
      this.isLoading = true;
    }
    this.errorMessage = null;

    this.validasiService.getPesananUntukValidasi().subscribe({
      next: (data) => {
        this.pesananList = data;
        this.isLoading = false;
        if (event) { event.target.complete(); }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Gagal memuat data. Silakan coba lagi.";
        this.isLoading = false;
        if (event) { event.target.complete(); }
      }
    });
  }

  handleRefresh(event: any) {
    this.loadPesanan(event);
  }

  async openValidasiForm(pesanan: PesananUntukValidasi) {
    const alert = await this.alertCtrl.create({
      header: `Validasi Pesanan #${pesanan.id}`,
      subHeader: `Vendor: ${pesanan.vendor.nama_vendor}`,
      message: `Jumlah dipesan: ${pesanan.jumlah_pesanan} porsi`,
      inputs: [
        {
          name: 'jumlah_fisik_diterima', // <-- Sesuaikan nama field
          type: 'number',
          placeholder: 'Jumlah Porsi Diterima',
          min: 0,
          attributes: { required: true }
        },
        {
          name: 'jumlah_rusak', // <-- Tambahkan input untuk jumlah rusak
          type: 'number',
          placeholder: 'Jumlah Porsi Rusak',
          min: 0,
          value: 0 // Default value
        },
        {
          name: 'kondisi',
          type: 'radio',
          label: 'Kondisi Baik',
          value: 'baik',
          checked: true
        },
        {
          name: 'kondisi',
          type: 'radio',
          label: 'Kondisi Rusak',
          value: 'rusak'
        },
        {
          name: 'catatan_validasi',
          type: 'textarea',
          placeholder: 'Catatan (opsional)'
        }
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Kirim',
          handler: async (data) => {
            // Validasi input
            if (data.jumlah_fisik_diterima === '' || data.jumlah_fisik_diterima < 0) {
              this.presentToast('Jumlah diterima harus diisi angka valid.', 'danger');
              return false;
            }
            if (data.jumlah_rusak === '' || data.jumlah_rusak < 0) {
              this.presentToast('Jumlah rusak harus diisi angka valid.', 'danger');
              return false;
            }

            // Buat payload dengan struktur yang benar
            const payload = {
              pesanan_makanan_id: pesanan.id,
              jumlah_fisik_diterima: parseInt(data.jumlah_fisik_diterima, 10),
              jumlah_rusak: parseInt(data.jumlah_rusak, 10),
              kondisi: data.kondisi,
              catatan_validasi: data.catatan_validasi
            };
            
            await this.submitValidasi(payload);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async submitValidasi(payload: any) {
    const loading = await this.loadingCtrl.create({ message: 'Mengirim data...' });
    await loading.present();

    this.validasiService.submitValidasiFisik(payload).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.presentToast('Validasi berhasil dikirim.', 'success');
        this.loadPesanan(); // Muat ulang daftar setelah berhasil
      },
      error: async (err) => {
        await loading.dismiss();
        const errorMsg = err.error?.message || 'Terjadi kesalahan.';
        this.presentToast(`Gagal: ${errorMsg}`, 'danger');
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color });
    toast.present();
  }
}
