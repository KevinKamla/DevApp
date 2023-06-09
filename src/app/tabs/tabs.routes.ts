import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then( m => m.HomePage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
      {
        path: 'statistic',
        loadComponent: () => import('../views/statistic/statistic.page').then( m => m.StatisticPage)
      },
      {
        path: 'project',
        loadComponent: () => import('../views/project/project.page').then( m => m.ProjectPage)
      },
      {
        path: 'apropos',
        loadComponent: () => import('../views/apropos/apropos.page').then( m => m.AproposPage)
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
