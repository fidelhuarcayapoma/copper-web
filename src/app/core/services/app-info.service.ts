import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AppInfo, APP_INFO } from '../data/resource/app-info';


@Injectable({
  providedIn: 'root',
})
export class AppInfoService {
  appInfo$ = new BehaviorSubject<AppInfo>(APP_INFO);

  constructor() {}

  changeAppInfo(appInfo: AppInfo): void {
    this.appInfo$.next(appInfo);
  }
}
