import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LabTestService {
  private apiUrl = environment.apiUrl + '/LabTest';  // Update API URL if needed

  constructor(private http: HttpClient) { }

  getLabTests(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${patientId}`);
  }

  addLabTest(labTest: any): Observable<any> {
    debugger;
    return this.http.post<any>(this.apiUrl, labTest);
  }

  updateLabTest(id: number, labTest: any): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, labTest);
  }

  deleteLabTest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ Upload Lab Report
  uploadLabReport(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/${id}/upload-report`, formData);
  }
  deleteReport(id: number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}/report`);
  }

  // ✅ Get Report URL
  getLabReport(id: number): string {
    return `${this.apiUrl}/${id}/report`;
  }
}
