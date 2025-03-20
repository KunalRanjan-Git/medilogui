import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { LabTestComponent } from "../lab-test/lab-test.component";

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LabTestComponent],
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
  isDobUnknown: boolean = false;

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
      if(this.medicines){
      this.medicines = this.medicines.sort((a, b) => new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime());
      }
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
    // ✅ Extract only the date part from "YYYY-MM-DDT00:00:00"
    const [year, month, day] = date.split('T')[0].split('-');

    return `${year}-${month}-${day}`; // ✅ Ensures correct YYYY-MM-DD format
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
    if(this.selectedPatient.dateOfBirth == '' || this.selectedPatient)
    {
    this.selectedPatient.dateOfBirth = this.selectedPatient.dateOfBirth ? this.selectedPatient.dateOfBirth : null;
    }
    if(this.selectedPatient.dateOfBirth == null && this.isDobUnknown == false)
    {
      this.alertService.error('Please Select Date of Birth or Select NA');
      return;
    }

    this.patientService.updatePatient(this.selectedPatient).subscribe(
      () => {
        this.alertService.success('Patient details updated successfully!');
        //alert('Patient details updated successfully!');
        this.loadPatientDetails();
        this.closeEditPatientModal();
        this.isDobUnknown = false;
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
  setDefaultDob() {
    if (this.isDobUnknown) {
      this.selectedPatient.dateOfBirth = ''; // Default Date
      this.selectedPatient.age = ''; // Set age to 0
    } else {
      this.selectedPatient.dateOfBirth = ''; // Clear the field
      this.selectedPatient.age = ''; // Reset age
    }
  }

  // ✅ Auto Calculate Age
  calculateAge() {
    if (!this.selectedPatient.dateOfBirth || this.selectedPatient.dateOfBirth === '') {
      this.selectedPatient.age = ''; // Set age to '' if DOB is default
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
  
navigateToPrescription(patientId: number) {
  this.router.navigate(['/prescription', patientId]);
}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
