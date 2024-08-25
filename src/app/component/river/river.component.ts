import { Component , OnInit, ViewChild} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { RiverService } from '../../_service/river.service';
import { river } from '../../_model/river.model';
import { MatTableDataSource } from '@angular/material/table';
import { menupermission, rivermenupermission } from '../../_model/user.model';
import { UserService } from '../../_service/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 

@Component({
  selector: 'app-river',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './river.component.html',
  styleUrl: './river.component.css'
})
export class RiverComponent  implements OnInit {

  riverlist!: river[];
  displayedColumns: string[] = ["id", "name", "action"];
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

  constructor(private service: RiverService, private userservice: UserService, private toastr: ToastrService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.Setaccess();
    this.Loadriver();
  }
  Setaccess() {

    let role = localStorage.getItem('userrole') as string;
    this.userservice.Getmenupermission(role, 'river').subscribe(item => {

      this._permission = item;
      console.log(this._permission);
    })
  }

  Loadriver() {
    //debugger
    this.service.Getall().subscribe(item => {
      this.riverlist = item;
      this.datasource = new MatTableDataSource<river>(this.riverlist);
      //console.log("River Data : "+this.datasource);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    })
  }

  functionedit(code: string) {
    if (this._permission.haveedit) {
      this.router.navigateByUrl('/river/edit/' + code)
    } else {
      this.toastr.warning('User not having edit access', 'warning')
    }
  }

  functiondelete(id: number) {
    if (this._permission.havedelete) {
      if (confirm('Are you sure?')) {
        this.service.Deleteriver(id).subscribe(item=>{
          this._response=item;
          if (this._response.result === 'pass') {
            this.toastr.success('Deleted successfully', 'Success');
            this.Loadriver();
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

export { river };

