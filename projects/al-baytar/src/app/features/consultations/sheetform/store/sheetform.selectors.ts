import { createSelector } from '@ngrx/store';
import { consultationAdapter } from './sheetform.reducers';
import {
  ConsultationsState,
  selectConsultations
} from '../../consultations.state';
import { selectRouterState } from '../../../../core/core.module';

const { selectEntities, selectAll } = consultationAdapter.getSelectors();
export const selectFormState = createSelector(
  selectConsultations,
  (state: ConsultationsState) => state.sheetform
);

export const selectBooks = createSelector(
  selectConsultations,
  (state: ConsultationsState) => {
    console.log('selectBooks - Full consultations state:', state);
    console.log('selectBooks - consultations slice:', state.consultations);
    return state.consultations;
  }
);

export const selectAllConsultations = createSelector(selectBooks, (consultationState) => {
  console.log('selectAllConsultations - consultationState:', consultationState);
  const result = selectAll(consultationState);
  console.log('selectAllConsultations - result from selectAll:', result);
  return result;
});

export const selectConsultationsEntities = createSelector(
  selectBooks,
  selectEntities
);

export const selectSelectedConsultation = createSelector(
  selectConsultationsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);
