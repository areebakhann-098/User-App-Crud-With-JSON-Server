import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../Model/user';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
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
  }

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

  onSubmit(form: NgForm): void {
    if (this.editMode) {
      this._userService.updateUser(this.user).subscribe((res) => {
        this.getUserList();
        this.editMode = false;
        form.reset();
        this._toastrService.success('User Updated Successfully', 'Success');
      });
    } else {
      this._userService.addUser(this.user).subscribe((res) => {
        this.getUserList();
        form.reset();
        this._toastrService.success('User Added Successfully', 'Success');
      });
    }
  }

  onEdit(userdata: UserModel) {
    this.user = userdata;
    this.editMode = true;
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

  onResetForm(form: NgForm) {
    form.reset();
    this.editMode = false;
    this.getUserList();
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
}
