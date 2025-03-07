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
  patient: any;
  medicines: any[] = [];
  patientId!: number;
  showMedicineModal: boolean = false;

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

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
