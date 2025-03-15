import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patient: any={};
  medicines: any[] = [];
  patientId!: number;
  showMedicineModal: boolean = false;

  showDeleteMedicineModal: boolean = false;

  showEditPatientModal: boolean = false;
  showEditMedicineModal: boolean = false;
  selectedMedicine: any = {};
  selectedMedicineID: any = {};
  selectedPatient: any = {};

  newMedicine = {
    medicineName: '',
    dosage: '',
    prescribedDate: '',
    patientId: 0
  };

  displayDob: string = '';
  displayAge: string = '';

  constructor(private route: ActivatedRoute, private patientService: PatientService, private router: Router,private alertService: AlertService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.patientId = Number(params.get('id'));
      this.loadPatientDetails();
      this.loadMedicineRecords();
    });
  }

  // ✅ Load Patient Details
  loadPatientDetails() {
    this.patientService.getPatientById(this.patientId).subscribe((data) => {
      this.patient = data;
    });
  }

  // ✅ Load Medicines
  loadMedicineRecords() {
    this.patientService.getMedicineRecords(this.patientId).subscribe((data) => {
      this.medicines = data;
    });
  }

  // ✅ Open Medicine Modal
  openMedicineModal() {
    this.showMedicineModal = true;
    this.newMedicine = { medicineName: '', dosage: '', prescribedDate: '', patientId: this.patient.id };
  }

  // ✅ Close Medicine Modal
  closeMedicineModal() {
    this.showMedicineModal = false;
  }

  // ✅ Open Delete Modal
  openDeleteMedicineModal(id:any) {
    this.showDeleteMedicineModal = true;
    this.selectedMedicineID = id;
  }

  // ✅ Close Delete Modal
  closeDeleteMedicineModal() {
    this.showDeleteMedicineModal = false;
  }

  // ✅ Open Edit Patient Modal
  openEditPatientModal(patient: any) {
    this.showEditPatientModal = true;
    this.selectedPatient = { ...patient };
    console.log(this.selectedPatient);
    this.selectedPatient.dateOfBirth = this.formatDateForInput(this.selectedPatient.dateOfBirth);
  }

  formatDateForInput(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0]; // ✅ Converts to YYYY-MM-DD
  }

  closeEditPatientModal() {
    this.showEditPatientModal = false;
  }

  // ✅ Open Edit Medicine Modal
  openEditMedicineModal(medicine: any) {
    this.selectedMedicine = { ...medicine };
    this.selectedMedicine.prescribedDate = this.formatDateForInput(this.selectedMedicine.prescribedDate);
    this.showEditMedicineModal = true;
  }

  closeEditMedicineModal() {
    this.showEditMedicineModal = false;
  }

  // ✅ Save Patient Details
  savePatientDetails() {
    this.patientService.updatePatient(this.selectedPatient).subscribe(
      () => {
        this.alertService.success('Patient details updated successfully!');
        //alert('Patient details updated successfully!');
        this.loadPatientDetails();
        this.closeEditPatientModal();
      },
      (error) => {
        console.error('Error updating patient:', error);
        this.alertService.error('Failed to update patient.');
        //alert('Failed to update patient.');
      }
    );
  }

  // ✅ Save Medicine
  saveMedicine() {
    this.patientService.addMedicine(this.newMedicine).subscribe(
      () => {
        this.alertService.success('Medicine added successfully!');
        //alert('Medicine added successfully!');
        this.closeMedicineModal();
        this.loadMedicineRecords();
      },
      (error) => {
        console.error('Error adding medicine:', error);
        this.alertService.error('Failed to add medicine.');
        //alert('Failed to add medicine.');
      }
    );
  }

  // ✅ Save Medicine Details
  saveMedicineDetails() {
    this.patientService.updateMedicine(this.selectedMedicine).subscribe(
      () => {
        this.alertService.success('Medicine details updated successfully!');
        //alert('Medicine details updated successfully!');
        this.closeEditMedicineModal();
        this.loadMedicineRecords();
      },
      (error) => {
        console.error('Error updating medicine:', error);
        this.alertService.error('Failed to update medicine.');
        //alert('Failed to update medicine.');
      }
    );
  }

  // ✅ Delete Medicine
  deleteMedicine(medicineId: number) {
    if (confirm('Are you sure you want to delete this medicine?')) {
      this.patientService.deleteMedicine(medicineId).subscribe(() => {
        // ✅ Remove the deleted medicine from the table
        this.medicines = this.medicines.filter(m => m.id !== medicineId);
        alert('Medicine deleted successfully!');
        this.loadMedicineRecords();
      }, error => {
        console.error('Error deleting medicine:', error);
      });
    }
  }

  deleteMedicineByID(){
    this.patientService.deleteMedicine(this.selectedMedicineID).subscribe(() => {
      // ✅ Remove the deleted medicine from the table
      this.medicines = this.medicines.filter(m => m.id !== this.selectedMedicine.id);
      this.alertService.success('Medicine deleted successfully!');
      //alert('Medicine deleted successfully!');
      this.closeDeleteMedicineModal();
      this.loadMedicineRecords();
    }, error => {
      console.error('Error deleting medicine:', error);
    });
  }

  // ✅ Auto Calculate Age
  calculateAge() {
    debugger;
    console.log(this.selectedPatient);
    if (!this.selectedPatient.dateOfBirth || this.selectedPatient.dateOfBirth === '1900-01-01T00:00:00') {
      this.selectedPatient.age = '0'; // Set age to 0 if DOB is default
      return;
    }
    if (this.selectedPatient.dateOfBirth) {
      const dob = new Date(this.selectedPatient.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      this.selectedPatient.age = age.toString();
    }
  }

  // ✅ Add this method inside the PatientDetailsComponent class
closeAllModals() {
  this.showMedicineModal = false;
  this.showEditPatientModal = false;
  this.showEditMedicineModal = false;
}
  

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
