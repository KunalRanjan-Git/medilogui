import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from '../../services/auth.service';

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
    dateOfBirth: '' as string | null,
    age: '',
    contactNumber: '',
    address: '',
    gender: ''
  };
  userRolePro:boolean = false;

  constructor(private authService: AuthService,private patientService: PatientService, private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.loadPatients();
    const userRole = this.authService.getUserRole();
    this.userRolePro = userRole ==='Pro';
  }

  

  // ✅ Load Patients from API
  loadPatients() {
    this.patientService.getPatients().subscribe(
      (data) => {
        this.patients = data;
        this.patients = this.patients.sort((a, b) => a.name.localeCompare(b.name));
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
      this.newPatient.dateOfBirth = ''; // Default Date
      this.newPatient.age = ''; // Set age to 0
    } else {
      this.newPatient.dateOfBirth = ''; // Clear the field
      this.newPatient.age = ''; // Reset age
    }
  }

  // ✅ Auto Calculate Age
  calculateAge() {
    if (!this.newPatient.dateOfBirth || this.newPatient.dateOfBirth === '') {
      this.newPatient.age = ''; // Set age to 0 if DOB is default
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

  printPatients() {
    const printWindow = window.open('', '', 'width=800,height=900');
    printWindow!.document.write(`
      <html>
      <head>
        <title>Kalyan Homeo Clinic - Patient List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid black; padding: 10px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Kalyan Homeo Clinic - Patient List</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Page No</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            ${this.patients.map((patient, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${patient.name}</td>
                <td>${patient.contactNumber}</td>
                <td>${patient.address}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    printWindow!.document.close();
    printWindow!.print();
  }


  exportPatientsAsPDF() {
    const doc = new jsPDF();
    doc.text('Kalyan Homeo Clinic - Patient List', 60, 10);

    const tableColumn = ["#", "Name", "Page No", "Address"];
    const tableRows: any[] = [];

    this.patients.forEach((patient, index) => {
      const patientData = [index + 1, patient.name, patient.contactNumber, patient.address];
      tableRows.push(patientData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Adjust starting Y position
      theme: 'grid', // Optional: "striped", "grid", or "plain"
    });

    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    doc.save(`Patient_List_${currentDate}.pdf`);
  }



  // ✅ Save New Patient to API
  savePatient() {
    if (this.newPatient.dateOfBirth == '' || this.newPatient) {
      this.newPatient.dateOfBirth = this.newPatient.dateOfBirth ? this.newPatient.dateOfBirth : null;
    }
    if (this.newPatient.dateOfBirth == null && this.isDobUnknown == false) {
      this.alertService.error('Please Select Date of Birth or Select NA');
      return;
    }
    this.patientService.addPatient(this.newPatient).subscribe(
      () => {
        this.alertService.success('Patient added successfully!');
        //alert('Patient added successfully!');
        this.closeModal();
        this.loadPatients(); // Refresh List
        this.isDobUnknown = false;
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
