import { Component , OnInit, ViewChild} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { RiverstationService } from '../../_service/riverstation.service';
import { riverStation } from '../../_model/riverstation.model';
import { MatTableDataSource } from '@angular/material/table';
import { menupermission } from '../../_model/user.model';
import { UserService } from '../../_service/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-riverstation',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './riverstation.component.html',
  styleUrl: './riverstation.component.css'
})
export class RiverstationComponent implements OnInit{

  riverstationlist!: riverStation[];
  displayedColumns: string[] = ["id", "name", "river", "latitude", "longitude","action"];
  datasource: any;
  _response:any;
  _permission: menupermission = { 
    code: '',
    name: '',
    haveview: false,
    haveadd: false,
    haveedit: false,
    havedelete: false,
    userrole: '',
    menucode: ''
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: RiverstationService, private userservice: UserService, private toastr: ToastrService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.Setaccess();
    this.Loadriverstation();
  }

  Setaccess() {

    let role = localStorage.getItem('userrole') as string;
    this.userservice.Getmenupermission(role, 'riverstation').subscribe(item => {

      this._permission = item;
      console.log(this._permission);
    })
  }

  Loadriverstation() {
    this.service.Getall().subscribe(item => {
      this.riverstationlist = item;
      this.datasource = new MatTableDataSource<riverStation>(this.riverstationlist);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    })
  }

  functionedit(code: string) {
    if (this._permission.haveedit) {
      this.router.navigateByUrl('/riverstation/edit/' + code)
    } else {
      this.toastr.warning('User not having edit access', 'warning')
    }
  }

  functiondelete(id: number) {
    if (this._permission.havedelete) {
      if (confirm('Are you sure?')) {
        this.service.DeleteriverStation(id).subscribe(item=>{
          this._response=item;
          if (this._response.result === 'pass') {
            this.toastr.success('Deleted successfully', 'Success');
            this.Loadriverstation();
          } else {
            this.toastr.error('Due to:' + this._response.message, 'Failed');
          }
        })
      }
    } else {
      this.toastr.warning('User not having delete access', 'warning')
    }
  }

} 
