// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Rute default saat aplikasi pertama kali dibuka akan mengarah ke login-page. Ini BENAR.
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full'
  },
  // Rute untuk halaman login. Ini BENAR.
  {
    path: 'login-page',
    loadChildren: () => import('./login-page/login-page.module').then(m => m.LoginPagePageModule)
  },
  // Rute untuk halaman utama pengguna biasa (dengan tab). Ini BENAR.
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // --- Rute utama untuk HRGA, arahkan ke HrgaTabsPage ---
  {
    path: 'hrga',
    loadChildren: () => import('./hrga/hrga-tabs/hrga-tabs.module').then(m => m.HrgaTabsPageModule)
  }

  // Catatan: 
  // Rute-rute individual seperti dashboard, pesanan, validasi-fisik, laporan
  // telah dipindahkan ke dalam hrga-tabs-routing.module.ts dan tidak perlu dideklarasikan di sini lagi.
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
