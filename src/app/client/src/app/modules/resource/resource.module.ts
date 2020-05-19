import { ResourceRoutingModule } from './resource-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceComponent, CurriculumCoursesComponent } from './components';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { ContentSearchModule } from '@sunbird/content-search';
import { CurriculumCourseDetailsComponent } from './components/curriculum-course-details/curriculum-course-details.component';
@NgModule({
  imports: [
    CommonModule,
    ResourceRoutingModule,
    SharedModule,
    SuiModule,
    SlickModule,
    FormsModule,
    CoreModule,
    TelemetryModule,
    NgInviewModule,
    SharedFeatureModule,
    CommonConsumptionModule,
    ContentSearchModule
  ],
  declarations: [ResourceComponent, CurriculumCoursesComponent, CurriculumCourseDetailsComponent]
})
export class ResourceModule {
  }
