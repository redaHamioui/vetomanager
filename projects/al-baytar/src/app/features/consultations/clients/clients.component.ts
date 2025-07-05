import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { Animal, Consultation } from '../sheetform/models/model';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { selectAllConsultations } from '../sheetform/store/sheetform.selectors';
import { select, Store } from '@ngrx/store';
import { State } from '../consultations.state';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddAnimalDialogComponent } from './add-animal-dialog/add-animal-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';
import { actionConsultationsDeleteOne } from '../sheetform/store/sheetform.actions';

// Assuming you have a Client interface defined
interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  // Add other properties as needed
}

@Component({
  selector: 'alb-client-list',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  newConsultation(): void {
    this.router.navigate(['/consultations/new']);
  }
  showDetail = false;
  newAnimal(): void {
    const dialogRef = this.dialog.open(AddAnimalDialogComponent, {
      width: '500px',
      data: {
        clientId: this.selectedConsultation?.client.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Animal added successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  openConsultationForm(): void {
    if (this.selectedConsultation) {
      this.router.navigate(['/consultations/edit', this.selectedConsultation.id]);
    } else {
      this.snackBar.open('Please select a consultation first', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  searchForm: FormGroup;
  
  consultations$: Observable<Consultation[]> = this.store.pipe(select(selectAllConsultations));

  animals: Animal[] = [];
  consultations: Consultation[] = [];
  dataSource: MatTableDataSource<Consultation> = new MatTableDataSource<Consultation>();
  displayedColumns: string[] = ['nom', 'phone', 'email', 'dateApparition'];
  
  private destroy$ = new Subject<void>();
  selectedConsultation: Consultation | null = null; // Track selected consultation

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder,  private store: Store<State>, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.searchForm = this.fb.group({
      searchText: [''],
    });
  }

  ngOnInit(): void { 
    this.consultations$
    .pipe(takeUntil(this.destroy$))
    .subscribe((consultations: Consultation[]) => {
      this.consultations = consultations || [];
      this.dataSource.data = consultations || [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  
  onSelectConsultation(consultation: Consultation): void {
    this.showDetail = true;
    this.selectedConsultation = consultation;
    this.router.navigate(['/consultations/client', consultation.client.id]);
  }

  clientDetails(id: string): void {
    this.router.navigate(['/consultations/client', id]);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.searchForm.get('searchText')?.valueChanges.pipe(
      map(text => text?.toLowerCase()),
      takeUntil(this.destroy$)
    ).subscribe(searchText => {
      this.applySearchFilter(searchText);
    });
  }

  applySearchFilter(searchText: string): void {
    const filteredData = this.consultations.filter(consultation => {
      const client = consultation.client;
      const searchTerm = searchText.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchTerm) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm)
      );
    });
    this.dataSource.data = filteredData;
  }

  resetFilter(): void {
    this.dataSource.data = this.consultations;
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map(item => ({
      name: item.client.name,
      phone: item.client.phone,
      email: item.client.email,
      date: item.dateApparition
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consultations');
    XLSX.writeFile(wb, 'consultations.xlsx');
  }

  addAnimal() {
    if (!this.selectedConsultation) {
      this.snackBar.open('Please select a consultation first', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(AddAnimalDialogComponent, {
      width: '400px',
      data: { clientId: this.selectedConsultation?.client.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New animal added:', result);
        // TODO: Update the UI or state with the new animal
        this.snackBar.open('Animal added successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteClient(): void {
    if (!this.selectedConsultation) {
      this.snackBar.open('Please select a consultation first', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }



    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Client',
        message: 'Are you sure you want to delete this client and all their consultations?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(actionConsultationsDeleteOne({ id: this.selectedConsultation?.id || "" }));
        this.snackBar.open('Client deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.selectedConsultation = null;
      }
    });
  }

  editClient(): void {
    if (!this.selectedConsultation) {
      this.snackBar.open('Please select a consultation first', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      width: '500px',
      data: {
        client: this.selectedConsultation.client
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Client updated:', result);
        // TODO: Update the UI or state with the updated client
        this.snackBar.open('Client updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }
}