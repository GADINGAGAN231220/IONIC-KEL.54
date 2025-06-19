import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidasiFisikPage } from './validasi-fisik.page';

const routes: Routes = [
  {
    path: '',
    component: ValidasiFisikPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidasiFisikPageRoutingModule {}
