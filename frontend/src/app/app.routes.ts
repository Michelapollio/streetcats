import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Addcat } from './components/addcat/addcat';
import { CatDetails } from './pages/cat-details/cat-details';
import { Info } from './pages/info/info';   

export const routes: Routes = [
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard }, // Questa esiste!
    { path: 'addcat', component: Addcat },
    {path: 'cat-details/:id', component: CatDetails},
    { path: 'info', component: Info },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' } // Reindirizza i visitatori alla dashboard
    
];