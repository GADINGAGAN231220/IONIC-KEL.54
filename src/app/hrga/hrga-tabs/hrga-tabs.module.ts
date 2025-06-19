import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HrgaTabsPageRoutingModule } from './hrga-tabs-routing.module';

import { HrgaTabsPage } from './hrga-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HrgaTabsPageRoutingModule
  ],
  declarations: [HrgaTabsPage]
})
export class HrgaTabsPageModule {}
