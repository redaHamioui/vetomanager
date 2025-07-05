import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from './../../../core/core.module';
import {
  actionConsultationsUpsertOne,
  actionFormReset,
  actionFormUpdate
} from './store/sheetform.actions';
import { selectFormState } from './store/sheetform.selectors';
import { Consultation, ExamenClinique, SheetForm, Symptom, Vaccin } from './models/model';
import { State } from '../.../../consultations.state';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { MatAccordion } from '@angular/material/expansion';
import { HttpClient } from '@angular/common/http';

// Constants for default values
const DEFAULT_STRING = 'Not available';
const DEFAULT_DATE = new Date();

@Component({
  selector: 'alb-sheetform',
  templateUrl: './sheetform.component.html',
  styleUrls: ['./sheetform.component.scss'], 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SheetformComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  // Animations and translations
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  // Dropdown Options
  animalTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Other'];
  doctors = [' Dr Mohamed Amine Jouahri', ' Dr Meriem Touhami', 'Dr Moustafa Jouahri'];
  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Toggle States
  showVaccinFields: boolean = true;
  sections: Record<string, boolean> = {
    client: true,
    animal: true,
    consultation: false
  };

  // Form Group
  form!: FormGroup;
selectedDr: any;
symptomsArray: string[] = [
  'Symptômes digestifs',
  'Symptômes respiratoires',
  'Symptômes dermatologiques',
  'Symptômes comportementaux',
  'Symptômes musculaires et articulaires',
  'Symptômes urinaires',
  'Symptômes cardiaques',
  'Symptômes neurologiques',
  'Symptômes endocriniens',
  'Symptômes infectieux',
  'Symptômes liés au système immunitaire',
  'Symptômes hématologiques',
  'Symptômes métaboliques',
  'Symptômes rénaux',
  'Symptômes ophtalmologiques',
  'Symptômes orthopédiques'
];

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private router: Router,
    private http: HttpClient
  ) {
    // Initialize form in ngOnInit
  }

  ngOnInit(): void {
    // Initialize form after component is initialized
    this.form = this.createForm();
    this.loadFormState();
  }

  private createForm(): FormGroup {
    if (!this.fb) {
      console.error('FormBuilder is not initialized');
      return new FormGroup({});
    }

    return this.fb.group({
      doctor: [''],
      client: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['']
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
        stadePhysiologique: [''],
        dateApparition: [''],
        dureeEvolution: [''],
        traitementInstaure: ['']
      }),
      symptoms: this.fb.array([]),
      vaccins: this.fb.array([]),
      examen: this.fb.group({
        etatGeneral: [''],
        temperature: [''],
        frequenceCardiaque: ['']
      })
    }, { updateOn: 'change' });
  }

  private loadFormState(): void {
    if (!this.form) {
      console.error('Form is not initialized');
      return;
    }

    this.store.pipe(select(selectFormState), take(1))
      .subscribe((form: any) => {
        if (form && form.sheetform) {
          this.form.patchValue(form.sheetform);
        }
      });
  }

  // Getters for Form Arrays
  get symptoms(): FormArray {
    return this.form.get('symptoms') as FormArray;
  }

  get vaccins(): FormArray {
    return this.form.get('vaccins') as FormArray;
  }

  // Toggle Sections
  toggleSection(section: string): void {
    this.sections[section] = !this.sections[section];
  }

  // Toggle Vaccin Fields
  noVaccins(): void {
    this.showVaccinFields = !this.showVaccinFields;
  }

  // Add Symptom
  addSymptom(): void {
    this.symptoms.push(this.createSymptomFormGroup());
  }

  // Remove Symptom
  removeSymptom(index: number): void {
    this.symptoms.removeAt(index);
  }

  // Add Vaccin
  addVaccinAsSymptom(): void {
    const vaccin = this.createVaccinFormGroup();
    this.vaccins.push(vaccin);
  }

  addVaccin() {
    this.vaccins.push(
      this.fb.group({
        type: [''],  // Removed extra space
        date: ['']
      })
    );
  }

  // Remove Vaccin
  removeVaccin(index: number): void {
    this.vaccins.removeAt(index);
  }

  // Create Symptom Form Group
  private createSymptomFormGroup(): FormGroup {
    return this.fb.group({
      type: [''],
      dateTraitement: [''],
      nomProduit: [''],
      dose: [''],
      duree: ['']
    });
  }

  // Create Vaccin Form Group
  private createVaccinFormGroup(): FormGroup {
    return this.fb.group({
      type: [''],
      date: ['']
    });
  }

  // Save Form
  save(): void {
    this.store.dispatch(actionFormUpdate({ form: this.form.value }));
  }

  // Submit Form
  submit(): void {
    if (this.form.valid) {
      const consultation = this.createConsultation(this.form);
      this.store.dispatch(actionConsultationsUpsertOne({ consultation }));
      this.store.dispatch(actionFormUpdate({ form: this.form.value }));
      this.router.navigate(['consultations/details', consultation.id]);
    } else {
      this.notificationService.error('Form is invalid. Please check all fields.');
    }
  }

  submit_old(): void {
    if (this.form.valid) {
      this.http.post('/api/consultations', this.form.value).subscribe(
        (response: any) => {
          // Assuming the backend returns the created consultation object
          this.router.navigate(['consultations/details', response.id]);
        },
        (error) => {
          this.notificationService.error('Failed to save consultation.');
          console.error('Error saving consultation:', error);
        }
      );
    } else {
      this.notificationService.error('Form is invalid. Please check all fields.');
    }
  }

  // Reset Form
  reset(): void {
    this.form.reset();
    this.store.dispatch(actionFormReset());
  }

  // Helper Methods
  private createConsultation(form: FormGroup): Consultation {
    const examen: ExamenClinique = {
      etatGeneral: form.value.examen?.etatGeneral || DEFAULT_STRING,
      temperature: form.value.examen?.temperature || 0,
      frequenceCardiaque: form.value.examen?.frequenceCardiaque || 0,
    };

    const vaccins: Vaccin[] = form.value.vaccins.map((vaccin: Vaccin) => ({
      type: vaccin.type || DEFAULT_STRING,
      date: vaccin.date || DEFAULT_DATE
    }));

    const symptomes: Symptom[] = form.value.symptoms.map((symptom: Symptom) => ({
      dateTraitement: symptom.dateTraitement || DEFAULT_DATE,
      description: symptom.description || DEFAULT_STRING,
      dose: symptom.dose || DEFAULT_STRING,
      duree: symptom.duree || DEFAULT_STRING,
      name: symptom.name || DEFAULT_STRING,
      nomProduit: symptom.nomProduit || DEFAULT_STRING,
      type: symptom.type || DEFAULT_STRING
    }));

    return {
      id: uuid(),
      doctor: form.value.doctor,
      client: {
        id: uuid(),
        codeClient: '', // Add if needed
        name: form.value.client?.name || DEFAULT_STRING,
        phone: form.value.client?.phone || DEFAULT_STRING,
        email: form.value.client?.email || DEFAULT_STRING,
        createdAt: DEFAULT_DATE,
        updatedAt: DEFAULT_DATE,
      },
      animal:{
        id: uuid(),
        name: form.value.animal?.name || DEFAULT_STRING,
        type: form.value.animal?.type || DEFAULT_STRING,
        age: form.value.animal?.age || DEFAULT_STRING,
        race: form.value.animal?.race || DEFAULT_STRING,
        sexe: form.value.animal?.sexe || DEFAULT_STRING,
        vaccins: vaccins
      } ,
      motif: form.value.consultation?.motif || DEFAULT_STRING,
      createdAt: DEFAULT_DATE,
      updatedAt: DEFAULT_DATE,
      stadePhysiologique: form.value.consultation?.stadePhysiologique || DEFAULT_STRING,
      dateApparition: form.value.consultation?.dateApparition ? new Date(form.value.consultation.dateApparition) : DEFAULT_DATE,
      dureeEvolution: form.value.consultation?.dureeEvolution || DEFAULT_STRING,
      traitementInstaure: form.value.consultation?.traitementInstaure || DEFAULT_STRING,
      symptomes: symptomes,
      examenClinique: examen,
      status: form.value.consultation?.status || 'Pending',
    };
  }
}