import { Routes } from '@angular/router';
import { AirtableAuthComponent } from './components/airtable-auth/airtable-auth.component';
import { AirtableDataComponent } from './components/airtable-data/airtable-data.component';
import { ScraperDashboardComponent } from './components/scraper-dashboard/scraper-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AirtableAuthComponent },
  { path: 'data', component: AirtableDataComponent },
  { path: 'scraper', component: ScraperDashboardComponent },
  { path: '**', redirectTo: 'auth' },
];
