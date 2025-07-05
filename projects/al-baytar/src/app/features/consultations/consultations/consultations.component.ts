import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../core/core.module';

import { State } from '../consultations.state';

@Component({
  selector: 'alb-consultations',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationsComponent implements OnInit {
  isAuthenticated$: Observable<boolean> | undefined;

  consultations = [
    { link: 'client', label: 'alb.consultations.menu.client' },
    { link: 'sheetform', label: 'alb.consultations.menu.consultationForm' },
    { link: 'list', label: 'alb.consultations.menu.consultations' }
   
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}
