import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {CountByVOrders} from "../../entity/countbyvorders";
import {ReportService} from "../../service/report.service";
import {CountByPOrders} from "../../entity/countByPOrders";

declare var google: any;

@Component({
  selector: 'app-countbyvorder',
  standalone: true,
  imports: [
    FormsModule,
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
    ReactiveFormsModule,
    RouterLink,
    MatColumnDef,
    MatHeaderCellDef
  ],
  templateUrl: './countbyvorder.component.html',
  styleUrl: './countbyvorder.component.scss'
})
export class CountbyvorderComponent implements OnInit{

  countbyVorders!: CountByVOrders[];
  data!: MatTableDataSource<CountByVOrders>;

  search!: FormGroup;

  columns: string[] = ['requestedDate', 'count'];
  headers: string[] = ['Month', 'Count'];
  binders: string[] = ['requestedDate', 'count'];

  @ViewChild('columnchart', { static: false }) columnchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs:ReportService,
              private fb:FormBuilder
  ) {

    this.search = this.fb.group({
      "startDate": new FormControl(''),
      "endDate": new FormControl(''),
    });
  }

  ngOnInit() {
    this.initialize();

  }

  initialize(){
    this.loadTable("")
  }

  handleSearch(){
    const ssstartDate  = this.search.controls['startDate'].value;
    const ssendDate  = this.search.controls['endDate'].value;

    let query = ""

    if(ssstartDate != null && ssstartDate.trim() !="") query = query + "&startDate=" + ssstartDate;
    if(ssendDate != null && ssendDate.trim() !="") query = query + "&endDate=" + ssendDate;

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  loadTable(query:string){
    this.rs.countByVorder(query).subscribe({
      next:data => {
        this.countbyVorders = data;
        //console.log(this.countbyPorders);
        this.loadCharts();
        this.data = new MatTableDataSource(this.countbyVorders);
      }
    });
  }

  clearSearch(){
    this.search.reset();
  }

  loadCharts(){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Date');
    barData.addColumn('number', 'Count');
    barData.addColumn('number', 'Expected');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Date');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'Date');
    lineData.addColumn('number', 'Count');

    this.countbyVorders.forEach((vo: CountByVOrders) => {
      barData.addRow([vo.requestedDate, vo.count,10]);
      pieData.addRow([vo.requestedDate, vo.count]);
      lineData.addRow([vo.requestedDate, vo.count]);
    });

    const barOptions = {
      title: 'Order Count (Bar Chart)',
      subtitle: 'Count of Orders By Date',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'Order Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Order Count (Line Chart)',
      height: 400,
      width: 600
    };

    const barChart = new google.visualization.ColumnChart(this.columnchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    lineChart.draw(lineData, lineOptions);
  }
}
