import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../../core/core.module';

import { ConsultationsComponent } from './consultations/consultations.component';
import { SheetformComponent } from './sheetform/sheetform.component';
import { ConsultationsDetailsComponent } from './consultations/consultations-details/consultations-details.component';
import { ConsultationsListComponent } from './consultations/consultations-list/consultations-list.component';
import { ClientsComponent } from './clients/clients.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationsComponent,
    children: [
      {
        path: '',
        redirectTo: 'sheetform',
        pathMatch: 'full'
      },
      {
        path: 'sheetform',
        component: SheetformComponent,
        data: { title: 'alb.consultations.menu.form' }
      },
      {
        path: 'details/:id',
        component: ConsultationsDetailsComponent
      },
      {
        path: 'list',
        component: ConsultationsListComponent
      },
      {
        path: 'client',
        component: ClientsComponent
      },
      {
        path: 'client/:id',
        component: ClientsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationsRoutingModule {}
