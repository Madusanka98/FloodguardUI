import { Component , OnInit} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RiverService } from '../../_service/river.service';
import { river } from '../../_model/river.model';

@Component({
  selector: 'app-addriver',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './addriver.component.html',
  styleUrl: './addriver.component.css'
})
export class AddriverComponent implements OnInit{
  _response: any;
  title = 'Add river';
  editcode = 0;
  isedit = false;
  editdata!: river;

  constructor(private builder: FormBuilder, private toastr: ToastrService, private router: Router,
    private service: RiverService, private act: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.editcode = this.act.snapshot.paramMap.get('id') as unknown as number;
    if (this.editcode != 0 && this.editcode != null) {
      this.isedit = true
      this.title = 'Edit river';
      this.riverform.controls['id'].disable();
      this.service.Getbycode(this.editcode).subscribe(item => {
        this.editdata = item;
        this.riverform.setValue({
          id: this.editdata.id, name: this.editdata.name, isactive: this.editdata.isactive
        })
      })
    }
  }

  riverform = this.builder.group({
    id: this.builder.control(0),
    name: this.builder.control('', [
      Validators.required, // Make 'name' field required
      Validators.minLength(3), // Optionally, enforce a minimum length (3 in this example)
    ]),
    isactive: this.builder.control(true)
  });

  Saveriver() {
    if (this.riverform.valid) {
      // Proceed with saving the river if form is valid
      let _obj: river = {
        id: this.riverform.value.id as unknown as number,
        name: this.riverform.value.name as string,
        isactive: this.riverform.value.isactive as boolean,
      };
  
      if (!this.isedit) {
        this.service.Createriver(_obj).subscribe(item => {
          this._response = item;
          if (this._response.result === 'pass') {
            this.toastr.success('Created successfully', 'Success');
            this.router.navigateByUrl('/river');
          } else {
            this.toastr.error('Due to:' + this._response.message, 'Failed');
          }
        });
      } else {
        _obj.id = this.editcode;
        this.service.Updateriver(_obj).subscribe(item => {
          this._response = item;
          if (this._response.result === 'pass') {
            this.toastr.success('Updated successfully', 'Success');
            this.router.navigateByUrl('/river');
          } else {
            this.toastr.error('Due to:' + this._response.message, 'Failed');
          }
        });
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.riverform.markAllAsTouched();
    }
  }
  

} 
