import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom, switchMap, catchError, map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

import {
  actionConsultationsDeleteOne,
  actionConsultationsUpsertOne,
  actionConsultationsUpsertOneSuccess,
  actionConsultationsUpsertOneFailure,
} from './sheetform.actions';
import { selectConsultations, State } from '../../consultations.state';
import { Consultation } from '../models/model';

export const CONSULTATION_KEY = 'CONSULTATIONS';

@Injectable()
export class SheetformEffects {
  persistConsultations = createEffect(() =>
    this.actions$.pipe(
      ofType(actionConsultationsUpsertOne),
      withLatestFrom(this.store.pipe(select(selectConsultations))),
      switchMap(([action, consultationsState]) => {
        const consultation = action.consultation;

        if (!consultation) {
          return of(actionConsultationsUpsertOneFailure({ error: 'Consultation data is missing.' }));
        }

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http
          .post<Consultation>('http://localhost:3001/api/consultations', consultation, { headers })
          .pipe(
            map((response) => {
              this.saveToLocalStorage(response); // Save successful response in LocalStorage
              return actionConsultationsUpsertOneSuccess({ consultation: response });
            }),
            catchError((error) => {
              console.error('Server not found, saving to LocalStorage', error);
              this.saveToLocalStorage(consultation); // Save locally as fallback
              return of(actionConsultationsUpsertOneSuccess({ consultation })); // Still dispatch success
            })
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private http: HttpClient
  ) {}

  private saveToLocalStorage(consultation: Consultation) {
    try {
      const storedData = localStorage.getItem(CONSULTATION_KEY);
      let consultations: Consultation[] = [];
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Handle both EntityState format and simple array format
        if (parsedData.entities && parsedData.ids) {
          // EntityState format
          consultations = parsedData.ids.map((id: string) => parsedData.entities[id]);
        } else if (Array.isArray(parsedData)) {
          // Simple array format
          consultations = parsedData;
        }
      }
      
      // Add new consultation
      const updatedConsultations = [...consultations, consultation];
      
      // Save as EntityState format to match reducer expectations
      const entityState = {
        ids: updatedConsultations.map(c => c.id),
        entities: updatedConsultations.reduce((acc, consultation) => {
          acc[consultation.id] = consultation;
          return acc;
        }, {} as { [key: string]: Consultation })
      };
      
      localStorage.setItem(CONSULTATION_KEY, JSON.stringify(entityState));
    } catch (e) {
      console.error('Error saving consultation to LocalStorage', e);
    }
  }
}
