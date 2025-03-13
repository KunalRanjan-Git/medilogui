import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  addPatient(patient: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Patients`, patient);
  }

  getPatients(name: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients?name=${name}`);
  }

  getPatientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/${id}`);
  }

  // ✅ Add Medicine
  addMedicine(medicine: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/MedicineRecords`, medicine);
  }

  getMedicineRecords(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicineRecords/${patientId}`);
  }
}
