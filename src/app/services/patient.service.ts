import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'https://localhost:7278/api';

  constructor(private http: HttpClient) {}

  getPatients(name: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients?name=${name}`);
  }

  getPatientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/${id}`);
  }

  getMedicineRecords(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicineRecords/${patientId}`);
  }
}
