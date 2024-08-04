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
import {CountByMotherRegistration} from "../../entity/countbymotherregistration";
import {ReportService} from "../../service/report.service";
import {CountByChildRegistration} from "../../entity/countbychildregistration";

declare var google: any;

@Component({
  selector: 'app-countbychildregistration',
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
    MatHeaderCellDef,
    MatColumnDef
  ],
  templateUrl: './countbychildregistration.component.html',
  styleUrl: './countbychildregistration.component.scss'
})
export class CountbychildregistrationComponent implements OnInit{

  countbychildreg!: CountByChildRegistration[];
  data!: MatTableDataSource<CountByChildRegistration>;

  search!: FormGroup;

  columns: string[] = ['yearmonth', 'count'];
  headers: string[] = ['Month', 'Count'];
  binders: string[] = ['yearmonth', 'count'];

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
    this.rs.getChildRegistrationCount(query).subscribe({
      next:data => {
        this.countbychildreg = data;
        //console.log(this.countbyPorders);
        this.loadCharts();
        this.data = new MatTableDataSource(this.countbychildreg);
      }
    });
  }

  clearSearch(){
    this.search.reset();
    this.loadTable("");
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

    this.countbychildreg.forEach((po: CountByMotherRegistration) => {
      barData.addRow([po.yearmonth, po.count]);
      pieData.addRow([po.yearmonth, po.count]);
      lineData.addRow([po.yearmonth, po.count]);
    });

    const columnOptions = {
      title: 'Child Count (Bar Chart)',
      subtitle: 'Count by Month',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const barOptions = {
      title: 'Child Count (Bar Chart)',
      subtitle: 'Count by Month',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'Child Count  (Pie Chart)',
      height: 400,
      width: 500
    };

    const lineOptions = {
      title: 'Child Count  (Line Chart)',
      height: 400,
      width: 550
    };


    const barChart = new google.visualization.BarChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    lineChart.draw(lineData, lineOptions);

  }

}
