import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';

export const childRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: '', loadChildren: './form/form.module#FormModule' }, 
            { path: 'form', loadChildren: './form/form.module#FormModule' },
            { path: 'index', loadChildren: './index/index.module#IndexModule' },
        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);
