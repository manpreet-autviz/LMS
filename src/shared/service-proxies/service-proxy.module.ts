import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from 'abp-ng2-module';

import * as ApiServiceProxies from './service-proxies';
import { CreatePromotionComponent } from 'admin/promotion/create-promotion/create-promotion.component';

@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        ApiServiceProxies.CourseManagementAppServicesServiceProxy,
        ApiServiceProxies.BlogAppServicesServiceProxy,
        ApiServiceProxies.CategoryAppServicesServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TopicsServiceProxy,
        ApiServiceProxies.TestSeriesServiceServiceProxy,
        ApiServiceProxies.SubjectServiceServiceProxy,
        ApiServiceProxies.QuestionServiceProxy,
        ApiServiceProxies.JobNotificationServiceServiceProxy,
        ApiServiceProxies.MockTestServiceProxy,
        ApiServiceProxies.ContentManagementServiceServiceProxy,
        ApiServiceProxies.SyllabusServiceProxy,
        ApiServiceProxies.CommonServiceServiceProxy,
        ApiServiceProxies.EnrollCoursesServiceProxy,
        ApiServiceProxies.EnrollMockTestServiceProxy,
        ApiServiceProxies.MockTestUserAnsServiceProxy,
        ApiServiceProxies.MockTestResultServiceServiceProxy,
        ApiServiceProxies.QuestionBlogAppSeviceServiceProxy,
        ApiServiceProxies.AdminDashBoradServiceServiceProxy,
        ApiServiceProxies.PaymentServiceProxy,
        ApiServiceProxies.BlogUserAnsServiceProxy,
        ApiServiceProxies.BlogResultServiceProxy,
        ApiServiceProxies.PromotionServiceProxy,
      
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
