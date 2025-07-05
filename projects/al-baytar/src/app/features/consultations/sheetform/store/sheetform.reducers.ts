import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SheetFormState, SheetForm, Consultation } from '../models/model';
import {
  actionConsultationsDeleteOne,
  actionConsultationsUpsertOne,
  actionFormReset,
  actionFormUpdate,
  actionConsultationsUpsertOneSuccess,
  actionConsultationsUpsertOneFailure,
} from './sheetform.actions';
import { Action, createReducer, on } from '@ngrx/store';

// Initial State for SheetForm
export const initialSheetFormState: SheetFormState = loadStateFromLocalStorage(
  'sheetformState',
  {
    sheetform: {} as SheetForm,
  }
);

// Initial State for Consultations with Entity Adapter
export interface ConsultationState extends EntityState<Consultation> {}

export const consultationAdapter: EntityAdapter<Consultation> =
  createEntityAdapter<Consultation>();

  export const initialConsultationState: ConsultationState = loadStateFromLocalStorage(
    'CONSULTATIONS',
    consultationAdapter.getInitialState({
      ids: [],
      entities: {},
    })
  );

// SheetForm Reducer
const sheetformReducerInternal = createReducer(
  initialSheetFormState,
  on(actionFormUpdate, (state, { form }) => ({
    ...state,
    sheetform: {
      ...form,
      client: {
        ...form.client,
        name: '*'.repeat(form.client?.name?.length || 0),
      },
    },
  })),
  on(actionFormReset, () => initialSheetFormState)
);

export function sheetformReducer(
  state: SheetFormState | undefined,
  action: Action
) {
  return sheetformReducerInternal(state, action);
}

// Consultation Reducer
const consultationReducerInternal = createReducer(
  initialConsultationState,
  on(actionConsultationsUpsertOne, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(actionConsultationsUpsertOneSuccess, (state, { consultation }) =>
    consultationAdapter.upsertOne(consultation, { ...state, loading: false, error: null })
  ),
  on(actionConsultationsUpsertOneFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),
  on(actionConsultationsDeleteOne, (state, { id }) =>
    consultationAdapter.removeOne(id, state)
  )
);

export function consultationReducer(
  state: ConsultationState | undefined,
  action: Action
) {
  let newState = consultationReducerInternal(state, action);

  // Sauvegarde dans LocalStorage après chaque modification
  saveStateToLocalStorage(newState, 'consultationState');

  return newState;
}

function saveStateToLocalStorage(state: any, key: string) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving to LocalStorage', e);
  }
}

function loadStateFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedState = localStorage.getItem(key);
    return storedState ? JSON.parse(storedState) : defaultValue;
  } catch (e) {
    console.error('Error loading from LocalStorage', e);
    return defaultValue;
  }
}
