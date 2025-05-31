import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// 使用独立组件方式启动应用
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error bootstrapping app:', err));
