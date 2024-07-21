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
import {CountByPOrders} from "../../entity/countByPOrders";
import {ReportService} from "../../service/report.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";


declare var google: any;

@Component({
  selector: 'app-countbyporder',
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
  templateUrl: './countbyporder.component.html',
  styleUrl: './countbyporder.component.scss'
})
export class CountbyporderComponent implements OnInit{

  countbyPorders!: CountByPOrders[];
  data!: MatTableDataSource<CountByPOrders>;

  search!: FormGroup;

  columns: string[] = ['requestedDate', 'count'];
  headers: string[] = ['Date', 'Count'];
  binders: string[] = ['requestedDate', 'count'];

  @ViewChild('barchart', { static: false }) barchart: any;
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
    this.rs.countByPorder(query).subscribe({
      next:data => {
        this.countbyPorders = data;
        //console.log(this.countbyPorders);
        this.loadCharts();
        console.log(query);
        this.data = new MatTableDataSource(this.countbyPorders);
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

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Date');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'Date');
    lineData.addColumn('number', 'Count');

    this.countbyPorders.forEach((po: CountByPOrders) => {
      barData.addRow([po.requestedDate, po.count]);
      pieData.addRow([po.requestedDate, po.count]);
      lineData.addRow([po.requestedDate, po.count]);
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

    const barChart = new google.visualization.BarChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    lineChart.draw(lineData, lineOptions);
  }
}
