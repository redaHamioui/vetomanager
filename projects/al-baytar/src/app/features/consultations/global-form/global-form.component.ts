import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'alb-global-form',
  templateUrl: './global-form.component.html',
  styleUrls: ['./global-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
