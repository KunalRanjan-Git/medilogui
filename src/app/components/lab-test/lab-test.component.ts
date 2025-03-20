import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTestService } from '../../services/lab-test.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-lab-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lab-test.component.html',
  styleUrls: ['./lab-test.component.css']
})
export class LabTestComponent implements OnInit {
  @Input() patientId!: number;
  labTests: any[] = [];
  newLabTest: any = { patientId: 0, testName: '', testDate: '' as string | null, status: 'Pending' };
  showModal: boolean = false;
  selectedReport: SafeResourceUrl | null = null; // Stores the report URL
  isUploading: boolean = false;
  isDeleting : boolean = false;

  constructor(private alertService : AlertService, private labTestService: LabTestService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadLabTests();
    this.newLabTest.PatientId = this.patientId;
  }

  loadLabTests() {
    this.labTestService.getLabTests(this.patientId).subscribe((data) => {
      if (data) {
        this.labTests = data;
      }
      else {
        this.labTests = [];
      }
    });
  }

  openAddLabTestModal() {
    this.showModal = true;
  }

  closeAddLabTestModal() {
    this.showModal = false;
  }


  closeReportModal() {
    this.selectedReport = null;
  }

  addLabTest() {
    
    debugger;
    if (!this.newLabTest.testName) {
      this.alertService.warning("Test Name is required");
      return;
    }
    if (this.newLabTest.testDate == '' || this.newLabTest) {
      this.newLabTest.testDate = this.newLabTest.testDate ? this.newLabTest.testDate : null;
    }

    this.labTestService.addLabTest(this.newLabTest).subscribe(() => {
      this.loadLabTests();
      this.showModal = false;
      this.alertService.success("Test Added Succeessfully");
      this.newLabTest = { patientId: this.patientId, testName: '', testDate: null, status: 'Pending' };
    });
  }

  updateStatus(test: any, status: string) {
    test.Status = status;
    this.labTestService.updateLabTest(test.id!, test).subscribe(() => {
      this.alertService.success("Status updated !");
      this.loadLabTests();
    });
  }

  uploadReport(event: any, test: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      this.alertService.warning("Only PDF files are allowed!");
      return;
    }

    this.isUploading = true;  // Show loader & disable button

    this.labTestService.uploadLabReport(test.id, file).subscribe(() => {
      this.alertService.success("Report uploaded successfully");
      this.loadLabTests();
      this.isUploading = false;
    }, (error) => {
      this.isUploading = false;
      this.alertService.error("Error uploading report");
      console.error(error);
    });
  }

  deleteReport(test: any) {
    this.alertService.confirm('Do you really want to delete this Report?').then((confirmed) => {
      if (confirmed) {
        this.isDeleting = true;
        this.labTestService.deleteReport(test.id!).subscribe(() => {
          this.alertService.success("Report deleted successfully");
          this.loadLabTests();
          this.isDeleting = false;
        }, error => {
          console.log(error);
          this.alertService.error("Failed to delete");
          this.loadLabTests();
          this.isDeleting = false;
          console.error('Error deleting patient:', error);
        });
      }
    });
  }

  deleteTest(test: any) {
    this.alertService.confirm('Do you really want to delete this Test?').then((confirmed) => {
      if (confirmed) {
          this.labTestService.deleteReport(test.id).subscribe((data) => {});
          this.labTestService.deleteLabTest(test.id).subscribe(() => {
          this.alertService.success("Test deleted successfully");
          this.loadLabTests();
        }, error => {
          this.alertService.error("Failed to delete");
          console.error('Error deleting patient:', error);
        });
      }
    });
  }

  openReport(test: any) {
    if (test.reportPath) {
      const reportUrl = this.labTestService.getLabReport(test.id);
      this.selectedReport = this.sanitizer.bypassSecurityTrustResourceUrl(reportUrl);
    }
  }

}
