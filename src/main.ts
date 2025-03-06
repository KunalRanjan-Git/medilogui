import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // Import HttpClient

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


  // bootstrapApplication(AppComponent, {
  //   providers: [provideHttpClient()] // Add HTTP Client provider
  // })
  //   .catch(err => console.error(err));