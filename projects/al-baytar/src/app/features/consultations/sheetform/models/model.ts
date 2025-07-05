import { EntityState } from "@ngrx/entity";
import { Doctor } from "./entities";

export interface Client {
  id: string;
  codeClient: string;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Animal {
  id: string;
  ClientId?: string;
  name: string;
  type: string;
  age: string;
  race: string;
  sexe: string;
  vaccins: Vaccin[];
  ConsultationsIds?: string[]
}

export interface Symptom {
  name: string;
  description: string;
}

export interface ExamenClinique {
  temperature: number;
  frequenceCardiaque: number;
}

export interface Consultation {
  id: string;
  doctor?: string;
  client: Client; 
  animal: Animal;
  motif: string;
  createdAt: Date;
  updatedAt: Date;
  stadePhysiologique: string; 
  dateApparition: Date;
  dureeEvolution: string;
  traitementInstaure: string;
  symptomes: Symptom[];
  examenClinique: ExamenClinique;
  status: string;
}


export interface SheetForm {
  client: Client;
  animal: Animal;
  consultation: Consultation;
}

export interface SheetFormState {
  sheetform: SheetForm;
}


export interface ConsultationState extends EntityState<Consultation> {}

export interface Symptom {
  type: string;
  dateTraitement: Date;
  nomProduit: string;
  dose: string;
  duree: string;
}

export interface Vaccin {
  type: string;
  date: Date;
}

export interface ExamenClinique {
  etatGeneral: string;
  temperature: number;
  frequenceCardiaque: number;
}

export interface SheetForm {
  client: Client;
  animal: Animal;
  consultation: Consultation;
}

export interface SheetFormState {
  sheetform: SheetForm;
}
