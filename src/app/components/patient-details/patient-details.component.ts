import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private patientService: PatientService, private router: Router) {}

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
        alert('Patient details updated successfully!');
        this.loadPatientDetails();
        this.closeEditPatientModal();
      },
      (error) => {
        console.error('Error updating patient:', error);
        alert('Failed to update patient.');
      }
    );
  }

  // ✅ Save Medicine
  saveMedicine() {
    this.patientService.addMedicine(this.newMedicine).subscribe(
      () => {
        alert('Medicine added successfully!');
        this.closeMedicineModal();
        this.loadMedicineRecords();
      },
      (error) => {
        console.error('Error adding medicine:', error);
        alert('Failed to add medicine.');
      }
    );
  }

  // ✅ Save Medicine Details
  saveMedicineDetails() {
    this.patientService.updateMedicine(this.selectedMedicine).subscribe(
      () => {
        alert('Medicine details updated successfully!');
        this.closeEditMedicineModal();
        this.loadMedicineRecords();
      },
      (error) => {
        console.error('Error updating medicine:', error);
        alert('Failed to update medicine.');
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
      alert('Medicine deleted successfully!');
      this.closeDeleteMedicineModal();
      this.loadMedicineRecords();
    }, error => {
      console.error('Error deleting medicine:', error);
    });
  }

  // ✅ Auto Calculate Age
  calculateAge() {
    if (this.patient.dateOfBirth) {
      const dob = new Date(this.patient.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      this.patient.age = age.toString();
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
