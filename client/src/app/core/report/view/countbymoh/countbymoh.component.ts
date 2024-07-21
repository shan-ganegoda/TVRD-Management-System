import {Component, OnInit, ViewChild} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource,
} from "@angular/material/table";
import {CountByPdh} from "../../entity/countByPdh";
import {ReportService} from "../../service/report.service";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

declare var google: any;

@Component({
  selector: 'app-countbymoh',
  standalone: true,
    imports: [
        MatGridList,
        MatGridTile,
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatTable,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatColumnDef,
        MatCardModule,
        NgForOf,
        MatHeaderCellDef,
        MatCellDef,
        MatHeaderRowDef,
        MatRowDef,
        RouterLink
    ],
  templateUrl: './countbymoh.component.html',
  styleUrl: './countbymoh.component.scss'
})
export class CountbymohComponent implements OnInit{

  countbypdh!: CountByPdh[];
  data!: MatTableDataSource<CountByPdh>;

  columns: string[] = ['name', 'count'];
  headers: string[] = ['PDHS', 'Count'];
  binders: string[] = ['name', 'count'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs:ReportService) {
  }

  ngOnInit() {

    this.rs.countByPdh().subscribe({
      next:data => {
        this.countbypdh = data;
        console.log(this.countbypdh);
        this.loadTable();
        this.loadCharts();
      }
    });

  }

  loadTable(){
    this.data = new MatTableDataSource(this.countbypdh);
  }

  loadCharts(){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'PDH');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'PDH');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'PDH');
    lineData.addColumn('number', 'Count');

    this.countbypdh.forEach((des: CountByPdh) => {
      barData.addRow([des.name, des.count]);
      pieData.addRow([des.name, des.count]);
      lineData.addRow([des.name, des.count]);
    });

    const barOptions = {
      title: 'MOH Count (Bar Chart)',
      subtitle: 'Count of MOH by PDH',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'MOH Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'MOH Count (Line Chart)',
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
