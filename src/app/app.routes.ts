import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'commande',
    loadComponent: () => import('./views/commande/commande.page').then( m => m.CommandePage)
  },
  {
    path: 'search',
    loadComponent: () => import('./views/search/search.page').then( m => m.SearchPage)
  },
  {
    path: 'category',
    loadComponent: () => import('./views/category/category.page').then( m => m.CategoryPage)
  },
  {
    path: 'listproduct/:id',
    loadComponent: () => import('./views/listproduct/listproduct.page').then( m => m.ListproductPage)
  },
  {
    path: 'dedailproduct/:id',
    loadComponent: () => import('./views/dedailproduct/dedailproduct.page').then( m => m.DedailproductPage)
  },
  {
    path: 'printcommande',
    loadComponent: () => import('./views/printcommande/printcommande.page').then( m => m.PrintcommandePage)
  },
  {
    path: 'historicdetail/:id',
    loadComponent: () => import('./views/historicdetail/historicdetail.page').then( m => m.HistoricdetailPage)
  },
  {
    path: 'historic',
    loadComponent: () => import('./views/historic/historic.page').then( m => m.HistoricPage)
  },
  {
    path: 'commande',
    loadComponent: () => import('./views/commande/commande.page').then( m => m.CommandePage)
  },
  {
    path: 'taks/:id',
    loadComponent: () => import('./views/taks/taks.page').then( m => m.TaksPage)
  },
];
