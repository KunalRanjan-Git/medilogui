import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass], // Import necessary Angular modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService] // Provide the service
})
export class LoginComponent {

  DummyKey: any = '';
  LicenseCode: any ='';
  licenseDays: number | null = null; // Default license days
  keyFlg:boolean=false;
  codeFlg:boolean= false;
  activeTab: string = 'login';

  loginData = { email: '', password: '' };
  userID:any;
  registerData = { name: '', role: '', email: '', password: '', };
  errMsg:any;
  isRenewModalOpen = false;
  userName: any;
  LicenseType: string | null = null;

  constructor(private authService: AuthService,private userService:UserService, private loginService: LoginService, private router: Router, private alertService: AlertService) { }

  onLogin() {
    this.loginService.login(this.loginData).subscribe(
      (response) => {
        if (response && response.role) {
          localStorage.setItem('userID', response.userID); // Store full user data
          this.authService.login('fake-jwt-token', response.role, response.name); // ✅ Store token and role

          // ✅ Redirect based on role
          if (response.role === 'Admin') {
            this.router.navigate(['/manage-users']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }

        // console.log('Login Success:', response);
        // localStorage.setItem('userRole', response.role); // Store user role
        // //localStorage.setItem('loginTime', Date.now().toString()); // Store login time
        // this.authService.login('fake-jwt-token');
        // this.router.navigate(['/dashboard']); // ✅ Redirect to Dashboard
      },
      (error) => {
        console.error('Login Error:', error);

        // ✅ Handle License Expired Error
        if (error?.error?.message === "LicenseExpired" || error?.error?.message=== "LicenseNotFound" ) {
          this.errMsg =error.error.message;
          if(this.errMsg == "LicenseExpired")
          {
          this.alertService.error('⚠️ License expired. Please renew your license to continue.');
          }
          if(this.errMsg == "LicenseNotFound")
          {
          this.alertService.error('⚠️ License Not Available.');
          }
          this.userID = error.error.userID;
          this.userName = error.error.name;
          this.isRenewModalOpen=true;
        } else {
          // this.alertService.error('Login failed! Check credentials.');
          this.alertService.error(error.error.message);
        }
      }
    );
  }

  onRegister() {
    this.loginService.register(this.registerData).subscribe(
      (response) => {
        this.alertService.success('Registration successful!'); // ✅ Show success message
        this.activeTab = 'login'; // ✅ Switch to login tab
      },
      (error) => {
        console.error('Registration Error:', error);
        this.alertService.error('Registration failed! Try again.');
      }
    );
  }

  validateLicenseCode() {
    this.licenseDays = this.decryptLicenseCode(this.LicenseCode);
    var typeFlg:boolean = false;
    if(this.LicenseType != ''){
      if(this.LicenseType == 'Pro' || this.LicenseType == 'User'){
        typeFlg = true;
      }
    }
    if(this.licenseDays != null && this.licenseDays>0 && typeFlg){
      this.codeFlg = true;
    }else{
      this.codeFlg = false;
    }
  }
  validateKey() {
    if(this.userName){
      const expectedKey = this.generateLicenseKey(this.userName); // Assume this.selectedUserName is set
      if (this.DummyKey.toUpperCase() === expectedKey) {
        this.keyFlg = true;
        } else {
        this.keyFlg = false;
        }
    } 
  }
  renewLicense() {
    if(!this.keyFlg){
      this.alertService.error("License Key is not Valid");
      return;
    }
    if(!this.codeFlg){
      this.alertService.error("License Code is not Valid");
      return;
    }
    if(this.codeFlg && this.keyFlg && this.licenseDays && this.LicenseType){
      this.userService.renewLicense(this.userID,this.LicenseType, this.licenseDays).subscribe(
        () => {
          this.alertService.success('License generated successfully!');
          this.userID = '';
          this.userName = '';
          this.closeRenewModal();
          this.activeTab = "login";
        },
        (error) => {
          console.error('Error generating license:', error);
          this.alertService.error('Failed to generate license.');
        }
      );
    }
  }
  closeRenewModal() {
    this.isRenewModalOpen = false;
  }
  decryptLicenseCode(encryptedCode: string): number {
    try {
      //const decodedDate = atob(encryptedCode); // Base64 Decode

      const decodedString = atob(encryptedCode); // ✅ Base64 Decode

      const parts = decodedString.split('-'); // ✅ Split by '-'
      if (parts.length !== 2) {
      throw new Error('Invalid License Code Format');
      }

      const decodedDate = parts[0]; // ✅ First part (YYYYMMDD)
      this.LicenseType = parts[1]; // ✅ Second part (License Type)
  
      // Extract YYYY, MM, DD
      const year = parseInt(decodedDate.substring(0, 4), 10);
      const month = parseInt(decodedDate.substring(4, 6), 10) - 1; // Months are 0-based
      const day = parseInt(decodedDate.substring(6, 8), 10);
  
      const licenseDate = new Date(year, month, day);
  
      if (isNaN(licenseDate.getTime())) {
        throw new Error("Invalid License Code");
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date (remove time)
      const diffDays = Math.ceil((licenseDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
      return diffDays > 0 ? diffDays : 0; // Ensure it doesn't go negative
    } catch (error) {
      console.error("Invalid License Code", error);
      return 0;
    }
  }
  
  generateLicenseKey(userName: string): string {
    // ✅ Fix Date Issue - Get Local Date (YYYYMMDD)
    const currentDate = new Date();
    const formattedDate = currentDate.getFullYear().toString() +
                          String(currentDate.getMonth() + 1).padStart(2, '0') +
                          String(currentDate.getDate()).padStart(2, '0');
  
    // ✅ Extract First Name (Before Space)
    let firstName = userName.split(' ')[0].toUpperCase();
  
    // ✅ Ensure First Name is at Least 8 Characters
    const alphabet = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
    let index = 0;
    while (firstName.length < 8) {
      firstName += alphabet[index];
      index++;
    }
  
    // ✅ Arrange Output: Letter - Digit - Letter - Digit...
    let rawKey = "";
    for (let i = 0; i < firstName.length; i++) {
      rawKey += firstName[i]; // Add letter
      if (i < formattedDate.length) {
        rawKey += formattedDate[i]; // Add corresponding digit
      }
    }
  
    // ✅ Insert "-" after every 4 characters
    let formattedKey = rawKey.match(/.{1,4}/g)?.join("-") || rawKey;

    // Example Usage
    //const userName = "kunal ranjan";
    //const date = 20250317
    //const licenseKey = this.generateLicenseKey(userName);
    //console.log(licenseKey); // Output: K2U0-N2A5-L0Z3-Y1X7
    return formattedKey;
  }
  
}
