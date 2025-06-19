import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from '../services/food.service';
import * as QRCode from 'qrcode';
// 1. Impor AlertController untuk menampilkan popup
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
  standalone: false
})
export class QrCodePage implements OnInit, AfterViewInit {
  qrSize: number = 256;
  qrTask: any;

  constructor(
    private router: Router,
    private foodService: FoodService,
    // 2. Tambahkan AlertController ke constructor
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillLeave() {
    console.log('Meninggalkan halaman, interval QR dihentikan.');
    clearInterval(this.qrTask);
  }

  ngAfterViewInit() {
    this.startQrGeneration();
  }

  startQrGeneration() {
    // Jalankan pertama kali
    this.generateQRCode();

    // Hapus interval lama jika ada untuk mencegah duplikasi
    clearInterval(this.qrTask); 

    // Atur interval baru untuk refresh QR code
    this.qrTask = setInterval(async () => {
      console.log('Memperbarui QR code...');
      await this.generateQRCode();
    }, 13000); // Refresh setiap 13 detik
  }

  async generateQRCode() {
    const canvas = document.querySelector('#qrCodeCanvas') as HTMLCanvasElement;
    if (!canvas) return; // Hentikan jika canvas tidak ditemukan

    // 3. Gunakan blok try-catch untuk menangani error dari API
    try {
      // Panggil service untuk mendapatkan token QR dari backend
      const response = await this.foodService.getQrCode();

      // Gambar QR code ke canvas jika berhasil
      QRCode.toCanvas(canvas, response.qr_token, {
        width: this.qrSize,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'M'
      }, (error) => {
        if (error) {
          console.error('Error saat menggambar QR code:', error);
          this.presentErrorAlert('Gagal menampilkan QR Code.');
        } else {
          console.log('QR Code berhasil ditampilkan!');
        }
      });

    } catch (error: any) {
      console.error('Gagal mendapatkan QR code dari server:', error);

      // Hentikan interval agar tidak terus-menerus memanggil API yang gagal
      clearInterval(this.qrTask);

      // Bersihkan canvas dari QR code lama
      const context = canvas.getContext('2d');
      context?.clearRect(0, 0, canvas.width, canvas.height);

      // Ambil pesan error dari response backend, atau gunakan pesan default
      const errorMessage = error?.error?.message || 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
      
      // Tampilkan pesan error kepada pengguna menggunakan popup
      await this.presentErrorAlert(errorMessage);
    }
  }
  
  // 4. Buat fungsi untuk menampilkan Alert (popup)
  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Gagal Memuat QR',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Arahkan pengguna kembali ke halaman home setelah melihat error
            this.navigateTo('/home'); 
          }
        }
      ],
      backdropDismiss: false // Pengguna harus menekan tombol OK
    });
    await alert.present();
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}