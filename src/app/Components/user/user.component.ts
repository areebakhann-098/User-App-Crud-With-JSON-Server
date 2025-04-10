import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../Model/user';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userList: UserModel[] = [];
  editMode: boolean = false;
  isFormVisible: boolean = false;  // Flag to control visibility of the form
  showUserList: boolean = false;  // Flag to control visibility of the user list

  user: UserModel = {
    department: "",
    name: "",
    mobile: "",
    email: "",
    gender: "",
    doj: "",
    city: "",
    salary: 0,
    address: "",
    status: false,
  };

  cityList: string[] = ["Abbottabad", "Multan", "Karachi", "Islamabad", "Faisalabad"];
  departmentList: string[] = ["IT", "HR", "Accounts", "Sales", "Management"];

  constructor(private _userService: UserService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this._userService.getUsers().subscribe((res) => {
      this.userList = res;
    });
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;  // Toggle form visibility
    this.showUserList = false;  // Hide user list when adding/editing a user
  }

  toggleUserList() {
    this.showUserList = !this.showUserList;  // Toggle user list visibility
    this.isFormVisible = false;  // Hide form when showing user list
  }

  onSubmit(form: NgForm): void {
    if (this.editMode) {
      this._userService.updateUser(this.user).subscribe((res) => {
        this.getUserList();
        this.editMode = false;
        form.reset();
        this.isFormVisible = false;  // Hide the form after successful update
        this._toastrService.success('User Updated Successfully', 'Success');
      });
    } else {
      this._userService.addUser(this.user).subscribe((res) => {
        this.getUserList();
        form.reset();
        this.isFormVisible = false;  // Hide the form after successful save
        this._toastrService.success('User Added Successfully', 'Success');
      });
    }
  }

  onEdit(userdata: UserModel) {
    this.user = userdata;
    this.editMode = true;
    this.isFormVisible = true;  // Show the form when editing
    this.showUserList = false;  // Hide user list when editing a user
  }

  onDelete(id: any) {
    const isConfirm = confirm('Are you sure want to delete this user?');
    if (isConfirm) {
      this._userService.deleteUser(id).subscribe((res) => {
        this._toastrService.error('User deleted successfully', 'Deleted');
        this.getUserList();
      });
    }
  }

 

  searchUserByName($event: Event) {
    const input = ($event.target as HTMLInputElement).value.toLowerCase();
    if (input) {
      this.userList = this.userList.filter(user =>
        user.name.toLowerCase().includes(input)
      );
    } else {
      this.getUserList();
    }
  }

  // Add the trackByIndex method
  trackByIndex(index: number, item: any): number {
    return index; // Return the index as the unique identifier
  }
}
