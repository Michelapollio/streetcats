import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    {path: 'register', component:Register},
    {path: 'login', component: Login},
    {path: 'dashboard', component:Dashboard},
    {path: '', redirectTo: '/login', pathMatch:'full'}
    
];
