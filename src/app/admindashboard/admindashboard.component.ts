import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { AdminDashboardDto, AdminDashBoradServiceServiceProxy, SessionServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';


import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as moment from 'moment';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent  extends AppComponentBase implements AfterViewInit, OnDestroy{
  selectedDateRange: any;
  maxDate: moment.Moment;
  datePickerConfig = {
    ranges: {
      "All Time": [moment().startOf("year"), moment().endOf("year")],
      "Last 30 Days": [moment().subtract(29, "days"), moment()],
      "Last 90 Days": [moment().subtract(89, "days"), moment()],
      "Next 90 Days": [moment(), moment().add(89, "days")],
      "Through end of year": [moment(), moment().endOf("year")],
    },

    locale: {
      format: "MM/DD/YYYY",
      separator: " To ", // default is ' - '
      applyLabel: "Search", // detault is 'Apply'
      cancelLabel: "Cancel", // detault is 'Cancel'
      firstDay: 0, // first day is monday
    },

  };
  dashboard: any[];
  count: any = [];
  chartData: any;
  totalStudent: any;
  loading= false;
  private chart: am4charts.XYChart;
  adminDashboard: AdminDashboardDto = new AdminDashboardDto();
  studentId: number;
  constructor(public injector: Injector,
     private _sessionService:SessionServiceProxy, 
     private common: CommonService, 
      private admindashboardService: AdminDashBoradServiceServiceProxy, private userService: UserServiceProxy,public changeDetect:ChangeDetectorRef) {
    super(injector);
   }

   ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {

  }



  bindChart() {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;
    let data = [];

    this.chartData.forEach(element => {
      data.push({ date: element.date.toDate(), name: "name", value: element.enrollCourseCount });
    });

    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY.value}";

    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;
  }

  ngOnInit(): void {
    var navContent = { title: "Dashboard", lengthh: "-1" }

    this.common.pageTitle.next(navContent)
    this.getStudent();
    this.getAllChartDetail();

  }


  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe(res => {
    this.studentId = res.user.id;
    this.getAllAdminDashboard();
  })
 }

  getAllChartDetail() {
    this.admindashboardService.getChartData().subscribe(res => {
      this.chartData = res;
      this.bindChart();
    })
  }
  getAllAdminDashboard() {
    this.loading=true;
    this.admindashboardService.getAdminDashboard().subscribe(res => {
    this.loading=false;
    this.adminDashboard = res;
    var totals=  this.adminDashboard.studentData.totalStudent;
    var totals1 = this.adminDashboard.courseData.totalCourses;
      //var ongoing=this.adminDashboard.liveClassesdata;
      this.changeDetect.detectChanges();

    },(err)=>{
      this.loading=false;
    });
  }

  changeDateRange(event) {
    var a: any
    var b: any
    if (event.startDate != null && event.endDate != null) {
      a = event.endDate._d;
      b = event.startDate._d;
      //this.getNotification(b, a)
    }
  }

}
