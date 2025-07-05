import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

@Component({
  selector: 'alb-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  releaseButler = 'assets/release-butler.png';
  consultations = [
    {
      animal: 'Dog',
      client: 'John Doe',
      date: '2024-10-30',
      status: 'Completed'
    },
    {
      animal: 'Cat',
      client: 'Jane Smith',
      date: '2024-10-28',
      status: 'Pending'
    },
    {
      animal: 'Rabbit',
      client: 'Alice Brown',
      date: '2024-10-25',
      status: 'Completed'
    },
    {
      animal: 'Parrot',
      client: 'Bob Johnson',
      date: '2024-10-20',
      status: 'Cancelled'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
