import { Component, OnInit } from '@angular/core';
//import { PatientService } from './services/patient.service'; // Ensure correct path
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [PatientService]
})
export class DashboardComponent implements OnInit {
  patients: any[] = []; // Holds API data
  filteredPatients: any[] = []; // Holds filtered data
  searchText: string = '';

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe(
      (data) => {
        this.patients = data;
        this.filteredPatients = data; // Initialize filtered list
      },
      (error) => console.error('Error fetching patients:', error)
    );
  }

  filterPatients() {
    this.filteredPatients = this.patients.filter(patient =>
      patient.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
