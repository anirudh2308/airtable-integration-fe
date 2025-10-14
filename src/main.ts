import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { provideAnimations } from '@angular/platform-browser/animations';

ModuleRegistry.registerModules([AllCommunityModule]);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(), // 👈 this enables MatSnackBar animations & overlays
  ],
});
