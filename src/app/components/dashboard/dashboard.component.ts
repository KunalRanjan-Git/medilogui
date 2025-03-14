import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [PatientService]
})
export class DashboardComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchText: string = '';
  showModal: boolean = false;

  newPatient = {
    name: '',
    dateOfBirth: '',
    age: '',
    contactNumber: '',
    address: '',
    gender: ''
  };

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit() {
    this.loadPatients();
  }

  // ✅ Load Patients from API
  loadPatients() {
    this.patientService.getPatients().subscribe(
      (data) => {
        this.patients = data;
        this.filteredPatients = data;
      },
      (error) => console.error('Error fetching patients:', error)
    );
  }

  // ✅ Search Patients
  filterPatients() {
    this.filteredPatients = this.patients.filter(patient =>
      patient.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // ✅ Navigate to Patient Details
  viewPatientDetails(patientId: number) {
    this.router.navigate(['/patient', patientId]);
  }

  // ✅ Open Modal
  openModal() {
    this.showModal = true;
  }

  // ✅ Close Modal
  closeModal() {
    this.showModal = false;
    this.newPatient = { name: '', dateOfBirth: '', age: '', contactNumber: '', address: '', gender: '' };
  }

  // ✅ Auto Calculate Age
  calculateAge() {
    if (this.newPatient.dateOfBirth) {
      const dob = new Date(this.newPatient.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      this.newPatient.age = age.toString();
    }
  }

  // ✅ Save New Patient to API
  savePatient() {
    this.patientService.addPatient(this.newPatient).subscribe(
      () => {
        alert('Patient added successfully!');
        this.closeModal();
        this.loadPatients(); // Refresh List
      },
      (error) => {
        console.error('Error adding patient:', error);
        alert('Failed to add patient.');
      }
    );
  }

  // ✅ Delete Medicine
  deletePatient(patientId: number) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(patientId).subscribe(() => {
        // ✅ Remove the deleted patient from the table
        this.patients = this.patients.filter(m => m.id !== patientId);
        alert('Patient deleted successfully!');
        this.loadPatients();
      }, error => {
        console.error('Error deleting patient:', error);
      });
    }
  }
}
