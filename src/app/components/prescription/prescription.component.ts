import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PatientService } from '../../services/patient.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './prescription.component.html',
  styleUrl: './prescription.component.css'
})
export class PrescriptionComponent {
  patient: any = {};
  todayDate: string = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');
  AgeSex: string = '';
  
  ClinicName = environment.ClinicName;

  userRolePro: boolean = false;

  // Prescription formats
  prescriptionFormats = environment.prescriptionFormats;

  selectedFormat = this.prescriptionFormats[0]; // Default format
  showHindi: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    const patientId: number = Number(this.route.snapshot.paramMap.get('id'));
    if (patientId) {
      this.patientService.getPatientById(patientId).subscribe((data) => {
        this.patient = data;
        this.AgeAndSex();
      });
    }
    const userRole = this.authService.getUserRole();
    if (userRole == 'Pro') {
      this.userRolePro = true;
    } else {
      this.userRolePro = false;
    }
  }

  AgeAndSex(){
    if (!this.patient.age || !this.patient.gender) {
      this.AgeSex = '';
    } else if (this.patient.gender!=''
      && this.patient.age != '') {
      this.AgeSex = '/';    
    }
  }

  selectFormat(formatId: number) {
    this.selectedFormat = this.prescriptionFormats.find(f => f.id === formatId) || this.selectedFormat;
    if (this.selectedFormat.id === 2) {
      this.showHindi = true;
    } else {
      this.showHindi = false;
    }
  }


  generatePrescription() {
    const content = document.getElementById('prescription-content');

    if (!content) {
      console.error("Prescription content not found!");
      return;
    }

    var fileName = `prescription_${new Date().toISOString().slice(0, 10)}.pdf`;
    if (this.patient) {
      const formattedDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
      fileName = `${this.patient.name}_${formattedDate}.pdf`;
    }

    // ✅ Add class before PDF generation
    content.classList.add('no-border');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    pdf.html(content, {
      callback: function (pdf) {
        pdf.save(fileName);
        // ✅ Remove class after saving PDF
        content.classList.remove('no-border');
      },
      x: 1,
      y: 1,
      margin:0,
      width: 208,
      windowWidth: 1200,
      html2canvas: {
        //scale: 0.3, // ✅ Increase scale for sharper text
        //dpi: 300, // ✅ Set high dpi for quality
        letterRendering: true, // ✅ Renders text more accurately
        useCORS: true // ✅ Fixes font loading issues
      }
    });
  }


}
