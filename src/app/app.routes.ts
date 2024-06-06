import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { AuthGuard } from './shared/guards/auth.guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
  ...authRoutes,
  { path: '', component: AppComponent, canActivate: [AuthGuard] }
];
