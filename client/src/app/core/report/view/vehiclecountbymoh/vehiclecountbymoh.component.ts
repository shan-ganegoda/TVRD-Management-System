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
import {RouterLink} from "@angular/router";
import {ReportService} from "../../service/report.service";
import {VehicleCountByMoh} from "../../entity/vehiclecountbymoh";

declare var google: any;

@Component({
  selector: 'app-vehiclecountbymoh',
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
    RouterLink,
    MatColumnDef,
    MatHeaderCellDef
  ],
  templateUrl: './vehiclecountbymoh.component.html',
  styleUrl: './vehiclecountbymoh.component.scss'
})
export class VehiclecountbymohComponent implements OnInit{
  vehicalcountbymohs!: VehicleCountByMoh[];
  data!: MatTableDataSource<VehicleCountByMoh>;

  columns: string[] = ['name', 'count'];
  headers: string[] = ['MOH', 'Count'];
  binders: string[] = ['name', 'count'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs:ReportService) {
  }

  ngOnInit() {

    this.rs.vehicleCountByMoh().subscribe({
      next:data => {
        this.vehicalcountbymohs = data;
        this.loadTable();
        this.loadCharts();
      }
    });

  }

  loadTable(){
    this.data = new MatTableDataSource(this.vehicalcountbymohs);
  }

  loadCharts(){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'MOH');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'MOH');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'MOH');
    lineData.addColumn('number', 'Count');

    this.vehicalcountbymohs.forEach((des: VehicleCountByMoh) => {
      barData.addRow([des.name, des.count]);
      pieData.addRow([des.name, des.count]);
      lineData.addRow([des.name, des.count]);
    });

    const barOptions = {
      title: 'Vehicle Count (Bar Chart)',
      subtitle: 'Count of Vehicle by MOH',
      orientation: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'Vehicle Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Vehicle Count (Line Chart)',
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
