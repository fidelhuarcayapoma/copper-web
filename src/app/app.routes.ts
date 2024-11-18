import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { UsersComponent } from './features/users/users.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guard/auth.guard';
import { LoginComponent } from './core/auth/login/login.component';
import { AuthResolver } from './core/resolver/auth.resolver';
import { AreaComponent } from './features/area/area.component';
import { EquipmentComponent } from './features/equipment/equipment.component';
import { CraftComponent } from './features/craft/craft.component';
import { MiningUnitComponent } from './features/mining-unit/mining-unit.component';
import { DocumentComponent } from './features/document/document.component';
import { ManagerComponent } from './features/manager/manager.component';
import { CourseComponent } from './features/course/course.component';
import { CourseDetailComponent } from './features/course/components/course-detail/course-detail.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'mineral-units',
        component: MiningUnitComponent,
      },
      {
        path: 'areas',
        component: AreaComponent,
      },
      {
        path: 'equipments',
        component: EquipmentComponent,
      },
      {
        path: 'crafts',
        component: CraftComponent,
      },

      {
        path: 'documents', 
        component: DocumentComponent,
      },
      {
        path: 'manager',
        component: ManagerComponent,
      },
      {
        path: 'courses',
        component: CourseComponent,
      },
      {
        path: 'courses/:id',
        component: CourseDetailComponent,
      }
    ],
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];