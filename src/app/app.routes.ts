import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/profile',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/user-profile/user-profile.component').then(m => m.UserProfileComponent),
    title: 'User Profile'
  },
  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Products'
  },
  {
    path: 'rating-demo',
    loadComponent: () => import('./components/star-rating-demo/star-rating-demo.component').then(m => m.StarRatingDemoComponent),
    title: 'Star Rating Demo'
  },
  {
    path: '**',
    redirectTo: '/profile'
  }
];
