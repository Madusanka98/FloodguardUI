import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RiverstationService } from '../../_service/riverstation.service';
import { riverStation } from '../../_model/riverstation.model';
import { river } from '../river/river.component';
import { RiverService } from '../../_service/river.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

// Custom Validator for Level Relationships
export function levelValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const alertLevel = control.get('alertLevel')?.value;
    const minorLevel = control.get('minorLevel')?.value;
    const majorLevel = control.get('majorLevel')?.value;

    if (alertLevel != null && minorLevel != null && majorLevel != null) {
      if (alertLevel < minorLevel || minorLevel > majorLevel) {
        return { levelsInvalid: true };
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-addriverstation',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './addriverstation.component.html',
  styleUrls: ['./addriverstation.component.css']
})
export class AddriverstationComponent implements OnInit {

  _response: any;
  title = 'Add River Station';
  editcode = 0;
  isedit = false;
  editdata!: riverStation;
  rivers: river[] = [];

  constructor(private builder: FormBuilder, private toastr: ToastrService, private router: Router,
              private service: RiverstationService, private riverservice: RiverService, private act: ActivatedRoute) { }

  ngOnInit(): void {
    this.editcode = this.act.snapshot.paramMap.get('id') as unknown as number;
    if (this.editcode != 0 && this.editcode != null) {
      this.isedit = true;
      this.title = 'Edit River Station';
      this.riverStationform.controls['id'].disable();
    }
    this.fetchRivers(); // Fetch rivers and then initialize form data if editing
  }

  riverStationform = this.builder.group({
    id: this.builder.control(0),
    name: this.builder.control('', Validators.required),
    river: this.builder.control<river | null>(null, Validators.required),
    latitude: this.builder.control('', [
      Validators.required, 
      Validators.min(-90), 
      Validators.max(90)
    ]),
    longitude: this.builder.control('', [
      Validators.required, 
      Validators.min(-180), 
      Validators.max(180)
    ]),
    isactive: this.builder.control(true),
    stationId: this.builder.control(0, Validators.required),
    alertLevel: this.builder.control('', [
      Validators.required,
      Validators.min(0)
    ]),
    minorLevel: this.builder.control('', [
      Validators.required,
      Validators.min(0)
    ]),
    majorLevel: this.builder.control('', [
      Validators.required,
      Validators.min(0)
    ]),
  }, { validators: levelValidator() });
  

  fetchRivers() {
    this.riverservice.Getall().subscribe(data => {
      this.rivers = data;
      if (this.isedit) {
        this.loadEditData(); // Load edit data after rivers are fetched
      }
    });
  }

  loadEditData() {
    this.service.Getbycode(this.editcode).subscribe(item => {
      this.editdata = item;
  
      this.riverStationform.patchValue({
        id: this.editdata.id,
        name: this.editdata.name,
        latitude: this.editdata.latitude,
        longitude: this.editdata.longitude,
        isactive: this.editdata.isactive,
        alertLevel: this.editdata.alertLevel !== null ? this.editdata.alertLevel.toString() : null, // Convert to string
        minorLevel: this.editdata.minorLevel !== null ? this.editdata.minorLevel.toString() : null, // Convert to string
        majorLevel: this.editdata.majorLevel !== null ? this.editdata.majorLevel.toString() : null, // Convert to string
      });
  
      // Check if rivers are loaded before setting the river
      if (this.rivers.length > 0) {
        const selectedRiver = this.rivers.find(r => r.id === this.editdata.river?.id) || null;
        this.riverStationform.controls['river'].setValue(selectedRiver);
      }
    });
  }
  
  

  SaveriverStation() {
    if (this.riverStationform.valid) {
      let _obj: riverStation = {
        id: this.riverStationform.value.id as unknown as number,
        name: this.riverStationform.value.name as string,
        river: this.riverStationform.value.river as river,
        latitude: this.riverStationform.value.latitude as string,
        longitude: this.riverStationform.value.longitude as string,
        isactive: this.riverStationform.value.isactive as boolean,
        stationId: this.riverStationform.value.stationId as unknown as number,
        alertLevel: this.riverStationform.value.alertLevel as unknown as number,
        minorLevel: this.riverStationform.value.minorLevel as unknown as number,
        majorLevel: this.riverStationform.value.majorLevel as unknown as number,
      };
  
      if (!this.isedit) {
        this.service.CreateriverStation(_obj).subscribe(item => {
          this._response = item;
          if (this._response.result === 'pass') {
            this.toastr.success('Created successfully', 'Success');
            this.router.navigateByUrl('/riverstation');
          } else {
            this.toastr.error('Due to: ' + this._response.message, 'Failed');
          }
        });
      } else {
        _obj.id = this.editcode;
        this.service.UpdateriverStation(_obj).subscribe(item => {
          this._response = item;
          if (this._response.result === 'pass') {
            this.toastr.success('Updated successfully', 'Success');
            this.router.navigateByUrl('/riverstation');
          } else {
            this.toastr.error('Due to: ' + this._response.message, 'Failed');
          }
        });
      }
    } else {
      // Mark all controls as touched to trigger validation messages
      this.riverStationform.markAllAsTouched();
    }
  }
  

  
}
