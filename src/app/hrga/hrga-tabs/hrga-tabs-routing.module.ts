// src/app/hrga/hrga-tabs/hrga-tabs-routing.module.ts

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrgaTabsPage } from './hrga-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: HrgaTabsPage,
    children: [
      {
        path: 'dashboard', // tab pertama
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'pesanan', // tab kedua
        loadChildren: () => import('../pesanan/pesanan.module').then(m => m.PesananPageModule)
      },
      {
        path: 'validasi', // tab ketiga
        loadChildren: () => import('../validasi-fisik/validasi-fisik.module').then(m => m.ValidasiFisikPageModule)
      },
      {
        path: 'laporan', // tab keempat
        loadChildren: () => import('../laporan/laporan.module').then(m => m.LaporanPageModule)
      },
      { // Redirect default jika masuk ke /hrga
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrgaTabsPageRoutingModule {}