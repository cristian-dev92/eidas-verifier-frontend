import { Routes } from '@angular/router';
import { VerifierDashboardComponent } from './components/verifier-dashboard.component';
import { WalletSimulatorComponent } from './components/wallet-simulator/wallet-simulator.component';
import { environment } from '../environments/environment';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: VerifierDashboardComponent },
  ...(environment.showWalletSimulator
    ? [{ path: 'wallet', component: WalletSimulatorComponent }]
    : []),
  { path: '**', redirectTo: 'dashboard' }
];
