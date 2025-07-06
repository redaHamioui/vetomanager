import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Consultation } from '../../sheetform/models/model';
import { select, Store } from '@ngrx/store';
import { State } from '../../consultations.state';
import { selectAllConsultations } from '../../sheetform/store/sheetform.selectors';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../../core/core.module';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { actionConsultationsDeleteOne, actionConsultationsUpsertOne } from '../../sheetform/store/sheetform.actions';

@Component({
  selector: 'alb-consultations-list',
  templateUrl: './consultations-list.component.html',
  styleUrls: ['./consultations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationsListComponent implements OnInit, OnDestroy {
validatePayment() {
throw new Error('Method not implemented.');
}
  dataSource: MatTableDataSource<Consultation> = new MatTableDataSource<Consultation>();
  displayedColumns: string[] = ['id', 'motif', 'createdAt', 'updatedAt', 'dateApparition', 'actions'];
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  private destroy$ = new Subject<void>();
  consultations: Consultation[] = [];
  searchForm: FormGroup;
  selectedConsultation: Consultation | null = null; // Track selected consultation

  consultations$: Observable<Consultation[]> = this.store.pipe(select(selectAllConsultations));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store<State>,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      searchText: [''], // New search input field
    });
  }

  ngAfterViewInit(): void {
    // Bind paginator and sort to dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    console.log('ConsultationsListComponent ngOnInit - Starting to subscribe to consultations');
    
    // Debug: Check what's in localStorage
    console.log('LocalStorage CONSULTATIONS:', localStorage.getItem('CONSULTATIONS'));
    console.log('LocalStorage consultationState:', localStorage.getItem('consultationState'));
    
    this.consultations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((consultations: Consultation[]) => {
        console.log('ConsultationsListComponent - Received consultations from store:', consultations);
        console.log('ConsultationsListComponent - Number of consultations:', consultations?.length || 0);
        console.log('ConsultationsListComponent - Type of consultations:', typeof consultations);
        console.log('ConsultationsListComponent - Is array:', Array.isArray(consultations));
        
        this.consultations = consultations || [];
        this.dataSource.data = consultations || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        console.log('ConsultationsListComponent - Updated dataSource.data:', this.dataSource.data);
        console.log('ConsultationsListComponent - Updated this.consultations:', this.consultations);
      });

    // Listen to changes in the search text input
    this.searchForm.get('searchText')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchText: string) => {
        this.applySearchFilter(searchText);
      });
  }

  applyFilter(): void {
    const fromDate = this.searchForm.get('fromDate')?.value;
    const toDate = this.searchForm.get('toDate')?.value;
    const searchTerm = this.searchForm.get('searchText')?.value?.toLowerCase(); // Get the search term and convert to lowercase

    this.dataSource.data = this.consultations.filter((consultation) => {
      const consultationDate = new Date(consultation.createdAt);

      // Date range filter
      const isDateInRange = (!fromDate || !toDate) || 
                            (consultationDate >= new Date(fromDate) && consultationDate <= new Date(toDate));

      // Search term filter (assuming you want to search in a specific field like 'motif')
      const matchesSearchTerm = !searchTerm || 
                                consultation.motif.toLowerCase().includes(searchTerm);

      return isDateInRange && matchesSearchTerm;
    });
  }

  applySearchFilter(searchText: string): void {
    this.dataSource.filter = searchText.trim().toLowerCase();
  }
    delete(id: string) {
      this.store.dispatch(actionConsultationsDeleteOne({ id: id }));
      this.router.navigate(['consultations/list']);
    }

  resetFilter(): void {
    this.searchForm.reset();
    this.dataSource.data = this.consultations; // Reset to full data
  }

  consultationDetails(id: string): void {
    this.router.navigate(['consultations/details', id]);
  }

  onSelectConsultation(consultation: Consultation): void {
    this.selectedConsultation = consultation; // Set the selected consultation
  }

  exportToExcel(): void {
    const data = this.dataSource.filteredData.map((consultation) => ({
      ID: consultation.id,
      Motif: consultation.motif,
      'Created At': consultation.createdAt,
      'Updated At': consultation.updatedAt,
      'Date Apparition': consultation.dateApparition,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consultations');

    // Generate a file name
    const fileName = `Consultations_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Write the file and trigger download
    XLSX.writeFile(workbook, fileName);
  }

  // Add test consultation for debugging
  addTestConsultation() {
    const testConsultation: Consultation = {
      id: 'test-' + Date.now(),
      doctor: 'Dr. Test',
      client: {
        id: 'client-1',
        codeClient: 'C001',
        name: 'Test Client',
        phone: '123456789',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      animal: {
        id: 'animal-1',
        name: 'Test Animal',
        type: 'Dog',
        age: '5',
        race: 'Golden Retriever',
        sexe: 'Male',
        vaccins: []
      },
      motif: 'Test consultation',
      createdAt: new Date(),
      updatedAt: new Date(),
      stadePhysiologique: 'Adult',
      dateApparition: new Date(),
      dureeEvolution: '1 day',
      traitementInstaure: 'Test treatment',
      symptomes: [],
      examenClinique: {
        etatGeneral: 'Bon',
        temperature: 38.5,
        frequenceCardiaque: 80
      },
      status: 'Pending'
    };
    
    console.log('Adding test consultation:', testConsultation);
    this.store.dispatch(actionConsultationsUpsertOne({ consultation: testConsultation }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}