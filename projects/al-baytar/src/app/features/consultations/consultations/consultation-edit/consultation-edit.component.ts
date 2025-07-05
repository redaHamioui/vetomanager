import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'alb-consultation-edit',
  templateUrl: './consultation-edit.component.html',
  styleUrls: ['./consultation-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationEditComponent implements OnInit {

  constructor(  private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit(): void {
  }

}
