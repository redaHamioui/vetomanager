import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Animal } from '../../sheetform/models/model';

@Component({
  selector: 'alb-add-animal-dialog',
  templateUrl: './add-animal-dialog.component.html',
  styleUrls: ['./add-animal-dialog.component.scss']
})
export class AddAnimalDialogComponent implements OnInit {
  animalForm: FormGroup;
  animalTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Other'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAnimalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clientId: string }
  ) {
    this.animalForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      age: [null],
      race: [''],
      sexe: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.animalForm.valid) {
      const newAnimal: Animal = {
        id: '', // TODO: Generate a unique ID
        ClientId: this.data.clientId,
        name: this.animalForm.value.name,
        type: this.animalForm.value.type,
        age: this.animalForm.value.age,
        race: this.animalForm.value.race,
        sexe: this.animalForm.value.sexe,
        vaccins: []
      };
      this.dialogRef.close(newAnimal);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 