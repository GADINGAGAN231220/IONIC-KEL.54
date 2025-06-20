// src/app/hrga/laporan/laporan.page.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { LaporanService, LaporanHarian, LaporanBulanan } from '../../services/hrga/laporan.service';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.page.html',
  styleUrls: ['./laporan.page.scss'],
  standalone: false
})
export class LaporanPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  // State
  segmentValue: 'harian' | 'bulanan' = 'harian';
  isLoading = false;
  errorMessage: string | null = null;
  
  // Data Laporan Harian
  laporanHarian: LaporanHarian[] = [];
  harianPage = 1;
  harianTotalPages = 1;
  filterTanggal: string | null = null;

  // Data Laporan Bulanan
  laporanBulanan: LaporanBulanan[] = [];
  bulananPage = 1;
  bulananTotalPages = 1;
  filterBulanTahun: string | null = null;
  
  constructor(private laporanService: LaporanService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadData(true);
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
    this.resetAndLoad();
  }
  
  resetAndLoad() {
    this.laporanHarian = [];
    this.harianPage = 1;
    this.laporanBulanan = [];
    this.bulananPage = 1;
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
    this.loadData(true);
  }
  
  filterChanged() {
    this.resetAndLoad();
  }

  loadData(isFirstLoad = false, event?: any) {
    if (isFirstLoad) {
      this.isLoading = true;
    }

    if (this.segmentValue === 'harian') {
      this.loadLaporanHarian(isFirstLoad, event);
    } else {
      this.loadLaporanBulanan(isFirstLoad, event);
    }
  }

  loadLaporanHarian(isFirstLoad: boolean, event?: any) {
    const tanggal = this.filterTanggal ? format(parseISO(this.filterTanggal), 'yyyy-MM-dd') : undefined;

    this.laporanService.getLaporanHarian(this.harianPage, tanggal).subscribe({
      next: (res) => {
        this.laporanHarian = [...this.laporanHarian, ...res.data];
        this.harianTotalPages = res.last_page;
        this.harianPage++;
        
        this.isLoading = false;
        if (event) event.target.complete();
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = this.harianPage > this.harianTotalPages;
        }
      },
      error: (err) => this.handleError(err, event)
    });
  }
  
  loadLaporanBulanan(isFirstLoad: boolean, event?: any) {
    const bulan = this.filterBulanTahun ? parseInt(format(parseISO(this.filterBulanTahun), 'M'), 10) : undefined;
    const tahun = this.filterBulanTahun ? parseInt(format(parseISO(this.filterBulanTahun), 'yyyy'), 10) : undefined;

    this.laporanService.getLaporanBulanan(this.bulananPage, bulan, tahun).subscribe({
      next: (res) => {
        this.laporanBulanan = [...this.laporanBulanan, ...res.data];
        this.bulananTotalPages = res.last_page;
        this.bulananPage++;

        this.isLoading = false;
        if (event) event.target.complete();
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = this.bulananPage > this.bulananTotalPages;
        }
      },
      error: (err) => this.handleError(err, event)
    });
  }

  handleError(err: any, event?: any) {
    console.error(err);
    this.errorMessage = "Gagal memuat data laporan.";
    this.isLoading = false;
    if (event) event.target.complete();
  }

  handleRefresh(event: any) {
    this.resetAndLoad();
    // Kasih sedikit delay agar user melihat proses refresh
    setTimeout(() => {
        event.target.complete();
    }, 500);
  }
}