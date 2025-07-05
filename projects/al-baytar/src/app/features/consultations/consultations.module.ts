import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SharedModule } from '../../shared/shared.module';
import { environment } from '../../../environments/environment';

import { FEATURE_NAME, reducers } from './consultations.state';
import { ConsultationsRoutingModule } from './consultations-routing.module';
import { ConsultationsComponent } from './consultations/consultations.component';

import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { ConsultationsEffects } from './consultations.effects';
import { SheetformComponent } from './sheetform/sheetform.component';
import { SheetformEffects } from './sheetform/store/sheetform.effects';
import { ClientsComponent } from './clients/clients.component';
import { AnimalsComponent } from './animals/animals.component';
import { ConsultationsListComponent } from './consultations/consultations-list/consultations-list.component';
import { ConsultationsDetailsComponent } from './consultations/consultations-details/consultations-details.component';
import { FormService } from './sheetform/managers/form-service';
import { GlobalFormComponent } from './global-form/global-form.component';
import { CoreModule } from '../../core/core.module';
import { ConsultationEditComponent } from './consultations/consultation-edit/consultation-edit.component';
import { AddAnimalDialogComponent } from './clients/add-animal-dialog/add-animal-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EditClientDialogComponent } from './clients/edit-client-dialog/edit-client-dialog.component';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/consultations/`,
    '.json'
  );
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    LazyElementsModule,
    SharedModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule,
    
    ConsultationsRoutingModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([ConsultationsEffects, SheetformEffects])
  ],
  declarations: [
    ConsultationsComponent,
    AuthenticatedComponent,
    SheetformComponent,
    ClientsComponent,
    AnimalsComponent,
    ConsultationsListComponent,
    ConsultationsDetailsComponent,
    GlobalFormComponent,
    ConsultationEditComponent,
    AddAnimalDialogComponent,
    ConfirmDialogComponent,
    EditClientDialogComponent
  ],
  providers: [FormService]
})
export class ConsultationsModule {
  constructor() {}
}
