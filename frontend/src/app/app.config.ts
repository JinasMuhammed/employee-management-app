import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { APP_ROUTE } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { JwtInterceptor } from '@core/interceptor/jwt.interceptor';
import { ErrorInterceptor } from '@core/interceptor/error.interceptor';
import { DirectionService, LanguageService } from '@core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MM_DD_YYYY_FORMATS }      from './shared/date-formats';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTE),
    provideAnimations(),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DirectionService,
    LanguageService,
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    // {
    //   provide: MAT_DATE_FORMATS,
    //   useValue: {
    //     parse: {
    //       dateInput: 'YYYY-MM-DD',
    //     },
    //     display: {
    //       dateInput: 'YYYY-MM-DD',
    //       monthYearLabel: 'YYYY MMM',
    //       dateA11yLabel: 'LL',
    //       monthYearA11yLabel: 'YYYY MMM',
    //     },
    //   },
    // },
    { provide: MAT_DATE_FORMATS,   useValue: MM_DD_YYYY_FORMATS },
    importProvidersFrom(FeatherModule.pick(allIcons)),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    provideAnimationsAsync(),
  ],
};
