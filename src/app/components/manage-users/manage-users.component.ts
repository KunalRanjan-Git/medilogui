import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  licenseDays: number | null = null; // Default license days
  LicenseCode:any = '';
  DummyKey: any = '';
  KeyValidation = false;
  selectedUserData: any ;
  selectedUser: any = {
    name: '',
    email: '',
    role: 'User',
    passwordHash: ''
  };
  isChangePasswordModalOpen = false;
  isLicenseModalOpen = false;
  addUserModalOpen =false;
  loggedInUserId: number | null = null;
  newUser: any = {
    name: '',
    email: '',
    role: 'User',
    password: ''
  };

  constructor(private userService: UserService, private alertService: AlertService) {}

  ngOnInit() {
    this.loadLoggedInUser();
    this.loadUsers();
  }

  loadLoggedInUser() {
    const userIdString = localStorage.getItem('userID'); 
    var userData = userIdString ? Number(userIdString) : null;
    if (userData) {
      this.loggedInUserId = userData;
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => { 
        this.users = data; 
        // **Filter out the logged-in user**
        this.users = data.filter(user => user.id !== this.loggedInUserId);
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.alertService.error('Failed to fetch users.');
      }
    );
  }

  addNewUser(){
    this.userService.addUser(this.newUser).subscribe(
      () => {
        this.alertService.success('User added successfully!');
        this.addUserModalOpen = false;
        this.loadUsers();
      },
      (error) => {
        console.error('Error adding user:', error);
        this.alertService.error('Failed to add user.');
      }
    );
  }

  updateUser(user: any) {
    this.userService.updateUser(user).subscribe(
      () => {
        this.alertService.success('User updated successfully!');
        this.isChangePasswordModalOpen = false;
        this.loadUsers();
      },
      (error) => {
        console.error('Error updating user:', error);
        this.alertService.error('Failed to update user.');
      }
    );
  }

  deleteUser(userId: number) {
    this.alertService.confirm('Do you really want to delete this user?').then((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(userId).subscribe(
          () => {
            this.alertService.success('User deleted successfully.');
            this.loadUsers();
          },
          (error) => {
            console.error('Error deleting user:', error);
            this.alertService.error('Failed to delete user.');
          }
        );
      }
    });
  }

  openLicenseModal(user: any) {
    this.selectedUserData = user;
    this.licenseDays = null; // Reset to default value
    this.isLicenseModalOpen = true;
  }

  openChangPasswordModal(user: any) {
    this.selectedUser = user;
    this.selectedUser.passwordHash = '';
    this.isChangePasswordModalOpen = true;
  }

  closeChangePasswordModal() {
    this.isChangePasswordModalOpen = false;
  }

  closeLicenseModal() {
    this.DummyKey = '';
    this.LicenseCode ='';
    this.isLicenseModalOpen = false;
  }

  openAddUserModal() {
    this.addUserModalOpen = true;
  }

  closeAddUserModal() {
    this.addUserModalOpen = false;
  }

  checkKey(){
    const expectedKey = this.generateLicenseKey(this.selectedUserData.name); // Assume this.selectedUserName is set
    if (this.DummyKey.toUpperCase() === expectedKey) {
    this.KeyValidation = true;
    } else {
    this.KeyValidation = false;
    }
  }

  generateLicense() {
    if(this.KeyValidation == false){
      this.alertService.error("Invalid License Key");
      return;
    }
    if (this.selectedUserData !== null && this.licenseDays) {
      this.userService.generateLicense(this.selectedUserData.id, this.licenseDays).subscribe(
        () => {
          this.alertService.success('License generated successfully!');
          this.closeLicenseModal();
          this.loadUsers();
        },
        (error) => {
          console.error('Error generating license:', error);
          this.alertService.error('Failed to generate license.');
        }
      );
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

  validateLicenseCode() {
    const extractedValue = this.extractMiddleValue(this.LicenseCode); // licenseCode from input box
    if (extractedValue) {
      this.licenseDays = Number(extractedValue);
    } else {
      console.error("Invalid input format!");
    }
  }
  

  extractMiddleValue(inputValue: string): string | null {
    // ✅ Ensure input contains exactly two '-'
    const parts = inputValue.split('-');
  
    if (parts.length === 3) {
      return parts[1]; // ✅ Extract the middle part
    } else {
      console.error("Invalid input format. Expected format: XX-YY-ZZ (any length)");
      return null;
    }
  }
  

  
  
}
