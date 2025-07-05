import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../../core/core.module';

import {
  consultationReducer,
  sheetformReducer 
} from './sheetform/store/sheetform.reducers';
import {
  Consultation,
  ConsultationState,
  SheetFormState
} from './sheetform/models/model';

// Define Feature Name
export const FEATURE_NAME = 'consultations';

// Define the ConsultationsState interface
export interface ConsultationsState {
  sheetform: SheetFormState;
  consultations: ConsultationState; // Array of consultations
}

// Define the overall state interface extending AppState
export interface State extends AppState {
  consultations: ConsultationsState; // Reference to ConsultationsState
}

// Create a feature selector for consultations
export const selectConsultations =
  createFeatureSelector<ConsultationsState>(FEATURE_NAME);

// Define the reducers mapping for ActionReducerMap
export const reducers: ActionReducerMap<ConsultationsState> = {
  sheetform: sheetformReducer, // Handles sheet form state
  consultations: consultationReducer // Handles consultations state
};
