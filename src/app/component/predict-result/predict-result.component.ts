import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HomeService } from '../../_service/home.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 
import { currentPredict } from '../../_model/CurrentPredict.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { predictResult } from '../../_model/PredictResult.model';

@Component({
  selector: 'app-predict-result',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './predict-result.component.html',
  styleUrl: './predict-result.component.css'
})
export class PredictResultComponent implements OnInit{
  currentPredictlist!: predictResult[];
  datasource: any;
  displayedColumns: string[] = ["dateRange", "stationName", "river", "rainfall", "riverHight", "status"];
  isShow: boolean = false;
  ConfigTimes: string[] = ['3 Hours', '6 Hours', '12 Hours', '24 Hours'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchForm: FormGroup;

  constructor(private service: HomeService, private toastr: ToastrService, private router: Router, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      configHours: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.Loadriver();
  }

  Loadriver() {
    this.service.GetallCurrentPredict("").subscribe(item => {
      if (item != null) {
        this.isShow = true;
        this.currentPredictlist = item;
        this.datasource = new MatTableDataSource<predictResult>(this.currentPredictlist);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      } else {
        this.isShow = false;
      }
    });
  }

  findresult() {
    if (this.searchForm.valid) {
      let configHoursValue = this.searchForm.get('configHours')?.value;
      if(configHoursValue == '3 Hours'){
        configHoursValue='0';
      }else if(configHoursValue == '6 Hours'){
        configHoursValue='1';
      }else if(configHoursValue == '12 Hours'){
        configHoursValue='3';
      }else if(configHoursValue == '24 Hours'){
        configHoursValue='7';
      }else{
        configHoursValue='';
      }
      console.log('Config Hours:', configHoursValue);
      this.service.GetallCurrentPredict(configHoursValue).subscribe(item => {
        if (item != null) {
          this.isShow = true;
          this.currentPredictlist = item;
          this.datasource = new MatTableDataSource<predictResult>(this.currentPredictlist);
          this.datasource.paginator = this.paginator;
          this.datasource.sort = this.sort;
        } else {
          this.isShow = false;
        }
      });
      // Add any additional logic needed when searching for results
    } else {
      this.toastr.error('Please select a configuration hour.');
    }
  }

  exportToExcel() {
    if (this.datasource != undefined) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datasource.data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Predict Results');
      XLSX.writeFile(wb, 'Predict_Results.xlsx');
    } else {
      this.toastr.warning('No data to export.');
    }
  }

  exportToPDF() {
    if (this.datasource != undefined) {
      const doc = new jsPDF();
      const columns = this.displayedColumns.map(col => ({ title: col, dataKey: col }));
      const rows = this.datasource.data.map((row: any) => {
        const data: any = {};
        this.displayedColumns.forEach(col => {
          data[col] = row[col];
        });
        return data;
      });
      (doc as any).autoTable(columns, rows);
      doc.save('Predict_Results.pdf');
    } else {
      this.toastr.warning('No data to export.');
    }
  }
}

