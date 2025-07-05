import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Consultation } from '../../sheetform/models/model';
import { select, Store } from '@ngrx/store';
import { selectSelectedConsultation } from '../../sheetform/store/sheetform.selectors';
import { State } from '../../consultations.state';
import { actionConsultationsDeleteOne } from '../../sheetform/store/sheetform.actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../../core/core.module';

@Component({
  selector: 'alb-consultations-details',
  templateUrl: './consultations-details.component.html',
  styleUrls: ['./consultations-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationsDetailsComponent implements OnInit {
  newVaccin: any = {
    type: '',
    date: null
  };

  newSymptom: any = {
    name: '',
    description: '',
    type: '',
    dateTraitement: null,
    nomProduit: '',
    dose: '',
    duree: ''
  };
showVaccinFields: any;

addVaccin() {
  this.vaccins.push({ type: '', date: '' });
}

removeVaccin(index: number) {
  this.vaccins.splice(index, 1);
}
addSymptom() {
  this.symptomes.push({ name: '', description: '', type: '', dateTraitement: '', nomProduit: '', dose: '', duree: 0 });
}

// Method to remove a symptom by index
removeSymptom(index: number) {
  this.symptomes.splice(index, 1);
}


  getStatusIndex(status: string): number {
    switch (status) {
      case 'Pending':
        return 0;
      case 'In Progress':
        return 1;
      case 'Completed':
        return 2;
      default:
        return 0; // Valeur par défaut si le statut est inconnu
    }
  }
  
  showSymptomForm: boolean = false;
  symptomForm!: FormGroup;
  selectedConsultation: any;  // Holds the selected consultation
  editMode: boolean = false;  // Switch between view and edit mode
  editedConsultation: any;
  vaccins: { type: string; date: string }[] = [];
  symptomes: { name: string; description: string; type: string; dateTraitement: string; nomProduit: string; dose: string; duree: number }[] = [];

  displayedColumns: string[] = ['medication', 'dosage', 'duration', 'instructions'];
  diagnosis = 'Infection bactérienne légère.';
   // Clinical examination data
   clinicalExamination = {
    etatGeneral: 'Bon',
    temperature: 38.5,
    frequenceCardiaque: 90,
    observations: 'Légère déshydratation, appétit normal.'
  };
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  // Animal information
  animale = {
    name: 'Buddy',
    species: 'Dog',
    age: 5,
    gender: 'Male',
    owner: 'John Doe'
  };

  patient = {
    name: 'John Doe',
    age: 30,
    gender: 'Male'
  };

  doctor = {
    name: 'Dr. Jane Smith',
    specialty: 'Vétérinaire Généraliste',
    signature: 'assets/signature.png' // Path to the doctor's signature image
  };

  treatments = [
    { medication: 'Amoxicillin', dosage: '250mg', duration: '7 days', instructions: '1 capsule every 12 hours' },
    { medication: 'Probiotic', dosage: '1 sachet', duration: '5 days', instructions: '1 sachet per day' }
  ];

  // Prescription data
  prescriptions = [
    { medication: 'Paracetamol', dosage: '500mg', duration: '5 days', instructions: 'Take 1 tablet every 6 hours' },
    { medication: 'Amoxicillin', dosage: '250mg', duration: '7 days', instructions: 'Take 1 capsule every 8 hours' },
    { medication: 'Ibuprofen', dosage: '400mg', duration: '3 days', instructions: 'Take 1 tablet every 12 hours' }
  ];
  
  currentDate = new Date(); 
  reject(arg0: string) {
  throw new Error('Method not implemented.');
  }
  validate(arg0: string) {
  throw new Error('Method not implemented.');
  }
  edit(arg0: string) {
  throw new Error('Method not implemented.');
  }
    
  onUpdate() {
  throw new Error('Method not implemented.');
  }
  viewInsuranceDetails() {
  throw new Error('Method not implemented.');
  }

  delete(id: string) {
    this.store.dispatch(actionConsultationsDeleteOne({ id: id }));
    this.router.navigate(['consultations/list']);
  }
  
  consultationId: string | null = '';
  
  // Observable for selected consultation
  selectedConsultation$: Observable<Consultation | undefined> = this.store.pipe(
    select(selectSelectedConsultation)
  );
  isLinear = false;

  notes: { date: Date; title: string; category: string; description: string }[] = [];

  // Note form
  noteForm!: FormGroup;
  noteCategories = ['Général', 'Diagnostic', 'Traitement', 'Suivi'];
  radioForm!: FormGroup;
  radios: any[] = [];
  symptoms: any[]=[];
  selectedFile: File | null = null;
  constructor(public store: Store<State>, private router: Router, private fb: FormBuilder) {
    this.symptomForm = this.fb.group({
      name: [''],
      description:  [''],
      type:  [''],
      dateTraitement:  [''],
      nomProduit: [''],
      dose:  [''],
      duree:  [''],
    });
    this.noteForm = this.fb.group({
      title: [''],
      category: [''],
      description: ['']
    });
    this.radioForm = this.fb.group({
      date: [''],
      zone: [''],
      observations: [''],
      type: ['']  // Add the type field
    });
  }

  ngOnInit(): void {
    this.selectedConsultation$.subscribe((result) => {
      console.log(result);
    });
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  addNote(): void {
    if (this.noteForm.valid) {
      const noteData = {
        date: new Date(),
        title: this.noteForm.get('title')?.value,
        category: this.noteForm.get('category')?.value,
        description: this.noteForm.get('description')?.value
      };
      this.notes.push(noteData);
      this.noteForm.reset(); // Clear the form
    }
  }
  addRadio(): void {
    if (this.radioForm.valid) {
      const newRadio = {
        id: this.radios.length + 1,
        date: this.radioForm.get('date')?.value,
        zone: this.radioForm.get('zone')?.value,
        observations: this.radioForm.get('observations')?.value,
        imageUrl: this.selectedFile ? URL.createObjectURL(this.selectedFile) : null
      };
      this.radios.push(newRadio);
      this.radioForm.reset();
      this.selectedFile = null;
    }
  }

  // Sélectionner un fichier
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  // Supprimer une radiographie
  deleteRadio(id: number): void {
    this.radios = this.radios.filter(radio => radio.id !== id);
  }
}
