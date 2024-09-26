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
import { Chart, ChartOptions  } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public chart: Chart | undefined;
  public test: Chart | undefined;
  currentPredictlist!: currentPredict[];
  datasource: any;
  displayedColumns: string[] = ["Date Range", "ConfigTime", "Station Name", "River", "Rainfall", "River Hight"];
  isShow: boolean = false;
  ConfigTimes: string[] = ['3 Hours', '6 Hours', '12 Hours', '24 Hours'];
  
public rathnapuraRHight: string[] = [];
public rathnapuraDRange: string[] = [];

public ellagawaRHight: string[] = [];
public ellagawaRDRange: string[] = [];

public putupaulaRHight: string[] = [];
public putupaulaRDRange: string[] = [];

public maguraRHight: string[] = [];
public maguraRDRange: string[] = [];

public kalawellawaRHight: string[] = [];
public kalawellawaDRange: string[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchForm: FormGroup;

  constructor(private service: HomeService, private toastr: ToastrService, private router: Router, private fb: FormBuilder) {
    
    this.searchForm = this.fb.group({
      configHours: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.Loadriver();
  
    
  
    
  }

  Loadriver() {
    this.service.GetallPredictResult("7").subscribe(item => {
      if (item != null) {
        this.isShow = true;
        this.currentPredictlist = item;
        this.datasource = new MatTableDataSource<currentPredict>(this.currentPredictlist);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;

        this.currentPredictlist.forEach(element => {
          if (element.stationName === "Ratnapura") {
            this.rathnapuraRHight = this.rathnapuraRHight.concat(element.riverHight.split(','));
            this.rathnapuraDRange = this.rathnapuraDRange.concat(element.dateRange.split(','));
          } else if (element.stationName === "Ellagawa") {
            this.ellagawaRHight = this.ellagawaRHight.concat(element.riverHight.split(','));
            this.ellagawaRDRange = this.ellagawaRDRange.concat(element.dateRange.split(','));
          } else if (element.stationName === "Putupaula") {
            this.putupaulaRHight = this.putupaulaRHight.concat(element.riverHight.split(','));
            this.putupaulaRDRange = this.putupaulaRDRange.concat(element.dateRange.split(','));
          } else if (element.stationName === "Magura") {
            this.maguraRHight = this.maguraRHight.concat(element.riverHight.split(','));
            this.maguraRDRange = this.maguraRDRange.concat(element.dateRange.split(','));
          } else if (element.stationName === "Kalawellawa") {
            this.kalawellawaRHight = this.kalawellawaRHight.concat(element.riverHight.split(','));
            this.kalawellawaDRange = this.kalawellawaDRange.concat(element.dateRange.split(','));
          }
        });
        this.generateCharts();
      

      } else {
        this.isShow = false;
      }
    });
  }

  generateCharts(): void {
    const labels = this.rathnapuraDRange;
    
    // Data for each chart
    const chartData = [
      {
        id: 'chart1',
        label: 'Putupaula',
        data: this.putupaulaRHight,
        fillColor: 'rgba(0, 123, 255, 0.2)', // Blue
        borderColor: 'rgba(0, 123, 255, 1)',
        floodLevels: [3, 4, 5]
      },
      {
        id: 'chart2',
        label: 'Ellagawa',
        data: this.ellagawaRHight,
        fillColor: 'rgba(255, 159, 64, 0.2)', // Orange
        borderColor: 'rgba(255, 159, 64, 1)',
        floodLevels: [10, 10.7, 12.2]
      },
      {
        id: 'chart3',
        label: 'Ratnapura',
        data: this.rathnapuraRHight,
        fillColor: 'rgba(40, 167, 69, 0.2)', // Green
        borderColor: 'rgba(40, 167, 69, 1)',
        floodLevels: [5.2, 7.5, 9.5]
      },
      {
        id: 'chart4',
        label: 'Magura',
        data: this.maguraRHight,
        fillColor: 'rgba(220, 53, 69, 0.2)', // Red
        borderColor: 'rgba(220, 53, 69, 1)',
        floodLevels: [4, 6, 7.5]
      },
      {
        id: 'chart5',
        label: 'Kalawellawa',
        data: this.kalawellawaRHight,
        fillColor: 'rgba(102, 16, 242, 0.2)', // Purple
        borderColor: 'rgba(102, 16, 242, 1)',
        floodLevels: [5, 6.5, 8]
      }
    ];

    // Generate each chart
    chartData.forEach(chart => {
      this.createChart(chart.id, labels, chart.data, chart.label, chart.fillColor, chart.borderColor, chart.floodLevels);
    });
  }

  createChart(id: string, labels: string[], data: string[], label: string, fillColor: string, borderColor: string, floodLevels: number[]): void {
    new Chart(id, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: fillColor,
            borderColor: borderColor,
            fill: true,
            tension: 0.1
          },
          ...this.createFloodLevelDatasets(floodLevels, labels)
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 15, // Adjust the max value according to your data
            ticks: {
              stepSize: 0.5
            },
            title: {
              display: true,
              text: 'Water Level (M)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }

  createFloodLevelDatasets(levels: number[], labels: string[]): any[] {
    const colors = [
      'rgba(183, 155, 16, 1)',  // GreenYellow (Alert Level)
      'rgba(40, 68, 210, 1)',   // Yellow (Minor Flood Level)
      'rgba(163, 5, 5, 1)',   // Orange (Major Flood Level)
      'rgba(255, 0, 0, 0.2)'      // Red (Critical Flood Level)
    ];
  
    const levelLabels = [
      'Alert Level',
      'Minor Flood Level',
      'Major Flood Level',
      'Critical Flood Level'
    ];
  
    return levels.map((level, index) => ({
      label: `${levelLabels[index]} (${level}M)`,
      data: Array(labels.length).fill(level),
      borderColor: colors[index],
      borderWidth: 1.5, 
      borderDash: [8, 10],
      fill: false,
      pointRadius: 0,
      tension: 0
    }));
  }

}
