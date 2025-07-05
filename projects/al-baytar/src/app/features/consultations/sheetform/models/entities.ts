// Clients
export interface Client {
    id: string; // Unique identifier (client_id)
    firstName: string;
    lastName: string;
    address?: string;
    phoneNo?: string; // Optional, 11-character phone number
  }
  
  // Doctors
  export interface Doctor {
    id: string; // Unique identifier (vcn_no)
    firstName: string;
    lastName: string;
    phoneNo?: string; // Optional, 11-character phone number
    email?: string; // Optional
    yearGraduated: number; // Graduation year
  }
  
  // Species
  export interface Species {
    id: string; // Auto-generated unique ID
    name: string; // Name of the species
    unit: "Avian" | "Large Animal" | "Small Animal"; // Enum for unit classification
  }
  
  // Breeds
  export interface Breed {
    id: string; // Auto-generated unique ID
    name: string; // Name of the breed
  }
  
  // Diagnosis
  export interface Diagnosis {
    id: string; // Auto-generated unique ID
    name: string; // Name of the diagnosis
  }
  
  // Patients
  export interface Patient {
    id: string; // Unique identifier (patient_id)
    clientId: string; // Reference to Client (client_id)
    speciesId: string; // Reference to Species (id)
    breedId: string; // Reference to Breed (id)
    sex: "Male" | "Female"; // Enum for sex
    ageGroup: "Young" | "Adult"; // Enum for age group
  }
  
  // Cases
  export interface Case {
    id: string; // Auto-generated unique ID
    patientId: string; // Reference to Patient (patient_id)
    date: string; // ISO date string
    status: "New" | "Updated"; // Enum for case status
    diagnosisId: string; // Reference to Diagnosis (id)
    caseType: "Medical" | "Surgical"; // Enum for case type
    notes?: string; // Optional notes
    doctorVcnNo: string; // Reference to Doctor (vcn_no)
  }
  
  // Pharmacy Inventory
  export interface PharmacyItem {
    id: string; // Auto-generated unique ID (item_id)
    tradeName: string; // Trade name of the medication
    genericName: string; // Generic name of the medication
    category?: string; // Category of the medication
    unit?: string; // Unit of measurement
    costPricePerUnit?: number; // Cost price per unit
    salePricePerUnit?: number; // Sale price per unit
    barcode?: string; // Optional unique barcode
    expirationDate?: string; // ISO date string for expiration date
  }
  
  // Prescriptions
  export interface Prescription {
    id: string; // Auto-generated unique ID
    patientId: string; // Reference to Patient (patient_id)
    prescribingDoctorVcnNo: string; // Reference to Doctor (vcn_no)
    date: string; // ISO date string
  }
  
  // Prescribed Medications
  export interface PrescribedMed {
    id: string; // Auto-generated unique ID
    prescriptionId: string; // Reference to Prescription (id)
    medicationId: string; // Reference to PharmacyItem (item_id)
    quantity: number; // Quantity prescribed
    frequency: string; // Frequency (e.g., "12 hourly", "Once", etc.)
    route: string; // Route of administration (e.g., "IV", "IM", "PO", etc.)
    date: string; // ISO date string
  }
  
  // Receipts
  export interface Receipt {
    id: string; // Auto-generated unique ID
    patientId: string; // Reference to Patient (patient_id)
    prescriptionId: string; // Reference to Prescription (id)
    date: string; // ISO date string
    totalAmount: number; // Total amount paid
    paymentMethod: "Cash" | "Card"; // Enum for payment method
  }
  
  // Patient Details View (Optional for frontend usage)
  export interface PatientDetails {
    patientId: string; // Patient ID
    clientId: string; // Client ID
    speciesId: string; // Species ID
    breedId: string; // Breed ID
    sex: "Male" | "Female"; // Patient sex
    ageGroup: "Young" | "Adult"; // Patient age group
    clientFirstName: string; // Client's first name
    clientLastName: string; // Client's last name
  }
  