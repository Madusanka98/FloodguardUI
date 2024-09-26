import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { registerconfirm, userregister } from '../../_model/user.model';
import { UserService } from '../../_service/user.service';
import { ToastrService } from 'ngx-toastr';
import { riverStation } from '../../_model/riverstation.model';
import { RiverstationService } from '../../_service/riverstation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private builder: FormBuilder, private service: UserService, private toastr: ToastrService, private riverStationService: RiverstationService,
    private router: Router) {}

  ngOnInit(): void {
    this.fetchRiverStations();
  }

  _response: any;
  userTypes: string[] = ['Admin', 'Staff', 'User'];
  riverStations: riverStation[] = [];

  _regform = this.builder.group({
    username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    name: this.builder.control('', Validators.required),
    email: this.builder.control('', [Validators.required, Validators.email]),
    phone: this.builder.control('', [
      Validators.required,
      Validators.pattern(/^(?:\+94\s?\d{9}|0\d{9})$/)  // Accepts either +94 followed by 9 digits or 0 followed by 9 digits
    ]),
    userType: this.builder.control('', Validators.required),
    riverStations: this.builder.control<riverStation | null>(null, Validators.required),
  })
  
  

  proceedregister() {
    debugger;
    if (this._regform.valid) {
      // Preprocess the phone number to ensure it starts with +94 and is correctly formatted
      let phone = this._regform.value.phone as string;
  
      // Check if the phone starts with '0' and replace it with '+94 '
      if (phone.startsWith('0')) {
        phone = `+94 ${phone.slice(1)}`; // Remove leading 0 and add '+94 '
      } else if (!phone.startsWith('+94')) {
        this.toastr.error('Phone number must start with +94 or 0', 'Invalid Format');
        return;
      }
  
      let _obj: userregister = {
        userName: this._regform.value.username as string,
        name: this._regform.value.name as string,
        phone: phone,  // Use the modified phone number
        email: this._regform.value.email as string,
        userType: this._regform.value.userType as string,
        riverStations: this._regform.value.riverStations as unknown as riverStation[],
      }
  
      this.service.Userregisteration(_obj).subscribe(item => {
        this._response = item;
        console.log(this._response);
        if (this._response.result === 'pass') {
          this.toastr.success('User Registered successfully', 'Success');
          this.router.navigateByUrl('/user');
        } else {
          this.toastr.error('Failed due to: ' + this._response.message, 'Registration Failed');
        }
      });
    }
  }
  

  fetchRiverStations() {
    this.riverStationService.Getall().subscribe(data => {
      this.riverStations = data;
    });
  }
}
