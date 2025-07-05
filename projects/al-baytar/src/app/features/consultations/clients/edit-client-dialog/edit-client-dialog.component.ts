import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from '../../sheetform/models/model';

@Component({
  selector: 'alb-edit-client-dialog',
  templateUrl: './edit-client-dialog.component.html',
  styleUrls: ['./edit-client-dialog.component.scss']
})
export class EditClientDialogComponent implements OnInit {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client }
  ) {
    this.clientForm = this.fb.group({
      name: [data.client.name, Validators.required],
      phone: [data.client.phone, Validators.required],
      email: [data.client.email]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.clientForm.valid) {
      const updatedClient: Client = {
        ...this.data.client,
        name: this.clientForm.value.name,
        phone: this.clientForm.value.phone,
        email: this.clientForm.value.email
      };
      this.dialogRef.close(updatedClient);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 