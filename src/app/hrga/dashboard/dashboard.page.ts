import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardSummary } from '../../services/hrga/dashboard.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  public dashboardData: DashboardSummary | null = null;
  public isLoading = true;
  public errorMessage: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  ionViewWillEnter() {
    if (!this.dashboardData) {
      this.loadDashboardData();
    }
  }

  async loadDashboardData(event?: any) {
    if (!event) {
      this.isLoading = true;
    }
    
    this.errorMessage = null;

    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.errorMessage = 'Gagal memuat data. Silakan coba lagi.';
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
        this.presentErrorToast(this.errorMessage);
      }
    });
  }

  handleRefresh(event: any) {
    this.loadDashboardData(event);
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  // Fungsi logout dengan konfirmasi
  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari aplikasi?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Ya, Keluar',
          cssClass: 'danger',
          handler: async () => {
            await this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  // Fungsi untuk melakukan logout
  private async performLogout() {
    const loading = await this.loadingCtrl.create({
      message: 'Sedang logout...',
      duration: 2000
    });

    await loading.present();

    try {
      // Panggil fungsi logout dari auth service
      await this.authService.logout();
      
      // Tampilkan toast berhasil logout
      const toast = await this.toastCtrl.create({
        message: 'Berhasil logout',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      // Redirect ke halaman login
      this.router.navigate(['/login'], { replaceUrl: true });
      
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Tampilkan toast error
      const toast = await this.toastCtrl.create({
        message: 'Gagal logout. Silakan coba lagi.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }
}