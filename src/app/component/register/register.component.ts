import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  constructor(private builder: FormBuilder, private service: UserService, private toastr: ToastrService,private riverStationService: RiverstationService,
    private router: Router) {

  }
  ngOnInit(): void {
    this.fetchRiverStations();
  }

  _response: any;
  userTypes: string[] = ['Admin', 'Staff', 'User'];
  riverStations: riverStation[] = [];

  _regform = this.builder.group({

    username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    //password: this.builder.control('', Validators.required),
    //confirmpassword: this.builder.control('', Validators.required),
    name: this.builder.control('', Validators.required),
    email: this.builder.control('', Validators.required),
    phone: this.builder.control('', Validators.required),
    userType: this.builder.control('', Validators.required),
    riverStations: this.builder.control<riverStation | null>(null, Validators.required), 
  })

  proceedregister() {
    debugger;
    if (this._regform.valid) {
      let _obj: userregister = {
        userName: this._regform.value.username as string,
        name: this._regform.value.name as string,
        phone: this._regform.value.phone as string,
        email: this._regform.value.email as string,
        userType: this._regform.value.userType as string,
        riverStations: this._regform.value.riverStations as unknown as riverStation[],
        //password: this._regform.value.password as string
      }
      this.service.Userregisteration(_obj).subscribe(item => {
        this._response = item;
        console.log(this._response);
        if (this._response.result == 'pass') {
          this.toastr.success('User Register successfully', 'Success');
            this.router.navigateByUrl('/user');
          /*let _confirmobj: registerconfirm = {
            userid: this._response.message,
            username: _obj.userName,
            otptext: ''
          }
          this.service._registerresp.set(_confirmobj);
          this.toastr.success('Validate OTP & complete the registeration', 'Registeration');
          this.router.navigateByUrl('/confirmotp');*/
        } else {
          this.toastr.error('Failed due to : ' + this._response.message, 'Registeration Failed')
        }
      });

    }
  }

  fetchRiverStations() {
    this.riverStationService.Getall().subscribe(data => {
      debugger;
      this.riverStations = data;
      //if (this.isedit) {
        //this.loadEditData(); // Load edit data after rivers are fetched
      //}
    });
  }

  /*loadEditData() {
    this.service.Getbycode(this.editcode).subscribe(item => {
      this.editdata = item;
      this.riverStationform.patchValue({
        id: this.editdata.id,
        name: this.editdata.name,
        latitude: this.editdata.latitude,
        longitude: this.editdata.longitude,
        isactive: this.editdata.isactive
      });

      // Set the river object after fetching the rivers
      const selectedRiver = this.rivers.find(r => r.id === this.editdata.river.id) || null;
      this.riverStationform.controls['river'].setValue(selectedRiver);
    });
  }*/

}