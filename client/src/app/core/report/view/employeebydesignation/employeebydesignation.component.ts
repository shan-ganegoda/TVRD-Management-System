import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {NgForOf} from "@angular/common";
import {ReportService} from "../../service/report.service";
import {CountByDesignation} from "../../entity/countByDesignation";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

declare var google: any;

@Component({
  selector: 'app-employeebydesignation',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatGridList,
    MatGridTile,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    NgForOf,
    MatColumnDef,
    MatHeaderCellDef,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './employeebydesignation.component.html',
  styleUrl: './employeebydesignation.component.scss'
})
export class EmployeebydesignationComponent implements OnInit{
  countByDesignations!: CountByDesignation[];
  data!: MatTableDataSource<CountByDesignation>;

  columns: string[] = ['designation', 'count'];
  headers: string[] = ['Designation', 'Count'];
  binders: string[] = ['designation', 'count'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs:ReportService) {
  }

  ngOnInit() {

    this.rs.countByDesignation().subscribe({
      next:data => {
        this.countByDesignations = data;
        // console.log(this.countbypdh);
        this.loadTable();
        this.loadCharts();
      }
    });

  }

  loadTable(){
    this.data = new MatTableDataSource(this.countByDesignations);
  }

  loadCharts(){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Designation');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Designation');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'Designation');
    lineData.addColumn('number', 'Count');

    this.countByDesignations.forEach((des: CountByDesignation) => {
      barData.addRow([des.designation, des.count]);
      pieData.addRow([des.designation, des.count]);
      lineData.addRow([des.designation, des.count]);
    });

    const barOptions = {
      title: 'Employee Count (Bar Chart)',
      subtitle: 'Count of Employee by Designation',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'Employee Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Employee Count (Line Chart)',
      height: 400,
      width: 600
    };

    const barChart = new google.visualization.BarChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    lineChart.draw(lineData, lineOptions);
  }
}
