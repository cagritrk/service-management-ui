import { Routes } from '@angular/router';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';

export const routes: Routes = [
    {
      path: 'services',
      component: ServiceListComponent,
      title: 'Services List'
    },
    {
      path: 'services/:id',
      component: ServiceDetailComponent,
      title: 'Service Details'
    },
    {
      path: '',
      redirectTo: '/services',
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: '/services'
    }
  ];
  
