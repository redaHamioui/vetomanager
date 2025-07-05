import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'alb-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
