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
  licenseDays: number = 30; // Default license days
  DummyKey: any = '';
  KeyValidation = false;
  selectedUserId: number | null = null;
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

  openLicenseModal(userId: number) {
    this.selectedUserId = userId;
    this.licenseDays = 30; // Reset to default value
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
    this.isLicenseModalOpen = false;
  }

  openAddUserModal() {
    this.addUserModalOpen = true;
  }

  closeAddUserModal() {
    this.addUserModalOpen = false;
  }

  checkKey(){
    if(this.DummyKey == '123456'){ 
      this.KeyValidation = true;
    }
    else{
      this.KeyValidation = false;
    }
  }

  generateLicense() {
    if (this.selectedUserId !== null) {
      this.userService.generateLicense(this.selectedUserId, this.licenseDays).subscribe(
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
}
