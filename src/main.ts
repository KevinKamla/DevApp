import { NgModule, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { defineCustomElements } from '@ionic/pwa-elements/loader';
// import { enableProdMode } from '@angular/core';

// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCdkx3Rnxbf1xzZFNMZF1bRndPMyBoS35RdUVkWHtednBURGJfV0Zz');

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
  ],
});

// platformBrowserDynamic()
// 	.bootstrapModule(NgModule)
// 	.catch((err) => console.log(err));


  
// defineCustomElements(window);