import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

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
  isDobUnknown: boolean = false;

  newPatient = {
    name: '',
    dateOfBirth: '',
    age: '',
    contactNumber: '',
    address: '',
    gender: ''
  };

  constructor(private patientService: PatientService, private router: Router,private alertService: AlertService) { }

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

  setDefaultDob() {
    if (this.isDobUnknown) {
      this.newPatient.dateOfBirth = '1900-01-01'; // Default Date
      this.newPatient.age = '0'; // Set age to 0
    } else {
      this.newPatient.dateOfBirth = ''; // Clear the field
      this.newPatient.age = ''; // Reset age
    }
  }

  // ✅ Auto Calculate Age
  calculateAge() {
    if (!this.newPatient.dateOfBirth || this.newPatient.dateOfBirth === '1900-01-01') {
      this.newPatient.age = '0'; // Set age to 0 if DOB is default
      return;
    }
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

  exportPatientsAsPDF() {
    // const doc = new jsPDF();
    // doc.text('Patient List', 80, 10);
  
    // const tableColumn = ["#", "Name", "Gender", "Contact"];
    // const tableRows: any[] = [];
  
    // this.patients.forEach((patient, index) => {
    //   const patientData = [index + 1, patient.name, patient.gender, patient.contactNumber];
    //   tableRows.push(patientData);
    // });
  
    // // Auto-table (Requires jsPDF autoTable plugin)
    // (doc as any).autoTable({
    //   head: [tableColumn],
    //   body: tableRows,
    //   startY: 20,
    // });
  
    // doc.save('Patient_List.pdf');
  }
  

  // ✅ Save New Patient to API
  savePatient() {
    this.patientService.addPatient(this.newPatient).subscribe(
      () => {
        this.alertService.success('Patient added successfully!');
        //alert('Patient added successfully!');
        this.closeModal();
        this.loadPatients(); // Refresh List
      },
      (error) => {
        console.error('Error adding patient:', error);
        this.alertService.error('Failed to add patient.');
        //alert('Failed to add patient.');
      }
    );
  }

  // ✅ Delete Medicine
  deletePatient(patientId: number) {
    this.alertService.confirm('Do you really want to delete this patient?').then((confirmed) => {
      if (confirmed) {
        this.patientService.deletePatient(patientId).subscribe(() => {
          // ✅ Remove the deleted patient from the table
          this.patients = this.patients.filter(m => m.id !== patientId);
          this.alertService.success('Patient deleted successfully.');
          //alert('Patient deleted successfully!');
          this.loadPatients();
        }, error => {
          console.error('Error deleting patient:', error);
        });
      }
    });

    // if (confirm('Are you sure you want to delete this patient?')) {
    //   this.patientService.deletePatient(patientId).subscribe(() => {
    //     // ✅ Remove the deleted patient from the table
    //     this.patients = this.patients.filter(m => m.id !== patientId);
    //     alert('Patient deleted successfully!');
    //     this.loadPatients();
    //   }, error => {
    //     console.error('Error deleting patient:', error);
    //   });
    // }
  }
}
