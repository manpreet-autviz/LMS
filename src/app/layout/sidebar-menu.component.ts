import { Component, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  Router,
  RouterEvent,
  NavigationEnd,
  PRIMARY_OUTLET,
} from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { MenuItem } from "@shared/layout/menu-item";

@Component({
  selector: "sidebar-menu",
  templateUrl: "./sidebar-menu.component.html",
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  homeRoute = "/app/about";

  constructor(injector: Injector, private router: Router) {
    super(injector);
    this.router.events.subscribe(this.routerEvents);
  }

  ngOnInit(): void {
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
    this.routerEvents
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = event.url !== "/" ? event.url : this.homeRoute;
        const primaryUrlSegmentGroup =
          this.router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
        if (primaryUrlSegmentGroup) {
          this.activateMenuItems("/" + primaryUrlSegmentGroup.toString());
        }
      });
  }
  getMenuItems(): MenuItem[] {
    return [
      new MenuItem(
        this.l("Dashboard"),
        "/app/home",
        "./assets/img/dashbrd.svg",
        "Pages.AdminDashboard"
      ),
      new MenuItem(
        this.l("Dashboard"),
        "/app/student/dashboard",
        "./assets/img/dashbrd.svg",
        "Pages.StudentDashboard"
      ),
      new MenuItem(
        this.l("User Management"),
        "",
        "./assets/img/user-mang.svg",
        "Pages.UserManagement",
        [
          new MenuItem(
            this.l("Student Management"),
            "/app/students",
            "./assets/img/student-mang.svg",
            "Pages.UserManagement"
          ),
          new MenuItem(
            this.l("Admin Management"),
            "/app/admin",
            "./assets/img/admin-mang.svg",
            "Pages.UserManagement"
          ),
          new MenuItem(
            this.l("Teacher Management"),
            "/app/teachers",
            "./assets/img/admin-mang.svg",
            "Pages.TeacherManagement"
          ),
          new MenuItem(
            this.l("Roles Management"),
            "/app/roles",
            "./assets/img/admin-mang.svg",
            "Pages.UserManagement"
          ),
        ]
      ),
      new MenuItem(
        this.l("Category"),
        "/app/category",
        "./assets/img/categry.svg",
        "Pages.Category"
      ),

     

      new MenuItem(
        this.l("Course"),
        "/app/course",
        "./assets/img/course.svg",
        "Pages.Course"
      ),
     

      new MenuItem(
        this.l("Syllabus"),
        "",
        "./assets/img/syllabus.svg",
        "Pages.Syllabus",
        [
          new MenuItem(
            this.l("Manage Subject"),
            "/app/subjects",
            "./assets/img/subject-mang.svg",
            "Pages.Syllabus.ManageSubject"
          ),
          new MenuItem(
            this.l("Manage Topics"),
            "/app/topics",
            "./assets/img/topics-mang.svg",
            "Pages.Syllabus.ManageTopics"
          ),
          // new MenuItem(
          //   this.l("Manage Syllabus"),
          //   "/app/syllabus",
          //   "./assets/img/syllabus-mang.svg",
          //   "Pages.Syllabus"
          // ),

        ]
      ),

      // new MenuItem(
      //   this.l("Questions Manage"),
      //   "",
      //   "./assets/img/question.svg",
      //   "Pages.QuestionsManage",
      //   [
      //     new MenuItem(
      //       this.l("Manage Question"),
      //       "/app/question",
      //       "./assets/img/question-mang.svg",
      //       "Pages.QuestionsManage.ManageQuestion"
      //     ),
      //     new MenuItem(
      //       this.l("Mock Test"),
      //       "/app/mocktests",
      //       "./assets/img/mock-test.svg",
      //       "Pages.QuestionsManage.MockTest"
      //     ),
      //     new MenuItem(
      //       this.l('Test Series'), '/app/testseries', './assets/img/test-series.svg', 'Pages.QuestionsManage.TestSeries'
      //     ),
      //   ]
      // ),

      new MenuItem(
        this.l("Mock Test"),
        "/app/mocktests",
        "./assets/img/mock-test.svg",
        "Pages.QuestionsManage.MockTest"
      ),
      new MenuItem(
        this.l("Content Managament"),
        "/app/contentmanagements",
        "./assets/img/content.svg",
        "Pages.ContentManagament"
      ),
      new MenuItem(
        this.l("Blog Management"),
        "/app/blogs",
        "./assets/img/blog-icon.svg",
        "Pages.BlogManagement"
      ),
      new MenuItem(
        this.l("Job Notification"),
        "/app/jobnotification",
        "./assets/img/job.svg",
        "Pages.JobNotification"
      ),
      // new MenuItem(
      //     this.l('Payment History'),
      //     '/app/payment-history',
      //     './assets/img/payment.svg',
      //     'Pages.StudentPaymentHistory'
      // ),

      new MenuItem(
        this.l("Payment History"),
        "/app/payment-history",
        "./assets/img/payment.svg",
        "Pages.PaymentHistory"
      ),

      new MenuItem(
        this.l('Promotion'),
        "/app/promotion",
        "./assets/img/promotion.svg",
        "Pages.UserManagement"
      ),

     

      new MenuItem(
        this.l("My Courses"),
        "/app/student/my-course/list/all-course",
        "./assets/img/course.svg",
        "Pages.StudentMyCourse"
      ),
      new MenuItem(
        this.l("Mock Test"),
        "/app/student/mock/upcoming",
        "./assets/img/mock-test.svg",
        "Pages.StudentMockTest"
      ),
      new MenuItem(
        this.l("Daily Feed"),
        "/app/student/daily-feed/daily-quiz",
        "./assets/img/blog-icon.svg",
        "Pages.StudentDailyFeed"
      ),

      new MenuItem(
        this.l("Job Notification"),
        "/app/student/job-notification",
        "./assets/img/job.svg",
        "Pages.StudentJobNotification"
      ),

      new MenuItem(
        this.l("LIVE Classes"),
        "/app/student/live-classes",
        "./assets/img/liveclasses.svg",
        "Pages.StudentLiveClasses"
      ),
    ];
  }
  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + "" + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.permissionName) {
      return true;
    }
    return this.permission.isGranted(item.permissionName);
  }
}
