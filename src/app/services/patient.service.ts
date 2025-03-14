import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = environment.apiUrl; // ✅ Use centralized API URL
  //private apiUrl = 'https://localhost:5001/api';
  //private apiUrl = 'http://localhost:5000/api'; // Base API URL Prod

  constructor(private http: HttpClient) {}

  // ✅ Add New Patient
  addPatient(patient: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Patients`, patient);
  }

  // ✅ Get All Patients (with optional name search)
  getPatients(name: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients?name=${name}`);
  }

  // ✅ Get Patient By ID
  getPatientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/${id}`);
  }

  // ✅ Update Patient Details
  updatePatient(patient: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patients/${patient.id}`, patient);
  }

  // ✅ Delete Patient
  deletePatient(patientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/patients/${patientId}`);
  }

  // ✅ Add Medicine
  addMedicine(medicine: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/MedicineRecords`, medicine);
  }

  // ✅ Get Medicines for a Patient
  getMedicineRecords(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicineRecords/${patientId}`);
  }

  // ✅ Update Medicine Details
  updateMedicine(medicine: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/medicineRecords/${medicine.id}`, medicine);
  }

  // ✅ Delete Medicine
  deleteMedicine(medicineId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/MedicineRecords/${medicineId}`);
  }
}
