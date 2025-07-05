import { createAction, props } from '@ngrx/store';
import { Consultation, SheetForm } from '../models/model';

export const actionFormUpdate = createAction(
  '[Form] Update',
  props<{ form: SheetForm }>()
);

export const actionFormReset = createAction('[Form] Reset');

export const actionConsultationsUpsertOne = createAction(
  '[Consultation] Upsert One',
  props<{ consultation: Consultation }>()
);

export const actionConsultationsDeleteOne = createAction(
  '[Consultations] Delete One',
  props<{ id: string }>()
);

export const actionConsultationsUpsertOneSuccess = createAction(
  '[Sheetform] Upsert One Consultation Success',
  props<{ consultation: Consultation }>()
);

export const actionConsultationsUpsertOneFailure = createAction(
  '[Sheetform] Upsert One Consultation Failure',
  props<{ error: string }>()
);
