import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  createSheetForm(): FormGroup {
    return this.fb.group({
      client: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: [''],
      }),
      animal: this.fb.group({
        name: [''],
        type: [''],
        age: [null],
        race: [''],
        sexe: ['']
      }),
      consultation: this.fb.group({
        date: [''],
        status: [''],
        motif: [''],
        dureeEvolution: [''],
        traitementInstaure: ['']
      })
    });
  }
}