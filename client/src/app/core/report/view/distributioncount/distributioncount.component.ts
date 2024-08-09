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
import {DistributionCount} from "../../entity/distributioncount";

declare var google: any;

@Component({
  selector: 'app-distributioncount',
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
  templateUrl: './distributioncount.component.html',
  styleUrl: './distributioncount.component.scss'
})
export class DistributioncountComponent implements OnInit{

  distributioncount!: DistributionCount[];
  //mohsByPacketsBelowH!: Mohcount[];
  data!: MatTableDataSource<DistributionCount>;

  columns: string[] = ['yearmonth', 'count'];
  headers: string[] = ['Month', 'Count'];
  binders: string[] = ['yearmonth', 'count'];

  //@ViewChild('columnchart', { static: false }) columnchart: any;
  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs:ReportService) {
  }

  ngOnInit() {

    this.rs.getDistributionCount().subscribe({
      next:data => {
        this.distributioncount = data;
        //console.log(this.countbypdh);
        this.loadTable();
        this.loadCharts();
      }
    });

  }

  loadTable(){
    this.data = new MatTableDataSource(this.distributioncount);
  }

  loadCharts(){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Month');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Month');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'Month');
    lineData.addColumn('number', 'Count');

    this.distributioncount.forEach((des: DistributionCount) => {
      barData.addRow([des.yearmonth, des.count]);
      pieData.addRow([des.yearmonth, des.count]);
      lineData.addRow([des.yearmonth, des.count]);
    });

    // this.mohsByPacketsBelowH.forEach((des: Mohcount) => {
    //   columnData.addRow([des.name, des.count]);
    // });



    const barOptions = {
      title: 'Packet Count (Bar Chart)',
      subtitle: 'Count of MOH by PDH',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'Packet Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Packet Count (Line Chart)',
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
