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
  (state: ConsultationsState) => state.consultations
);

export const selectAllConsultations = createSelector(selectBooks, selectAll);

export const selectConsultationsEntities = createSelector(
  selectBooks,
  selectEntities
);

export const selectSelectedConsultation = createSelector(
  selectConsultationsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);
