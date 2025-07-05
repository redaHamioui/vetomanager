import browser from 'browser-detect';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment as env } from '../../environments/environment';

import {
  authLogin, 
  authLogout,
  routeAnimations,
  LocalStorageService,
  selectIsAuthenticated,
  selectSettingsStickyHeader,
  selectSettingsLanguage,
  selectEffectiveTheme,
  AppState
} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage
} from '../core/settings/settings.actions';

@Component({
  selector: 'alb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = 'assets/logo2.png';
  languages = ['en', 'fr', 'ar'];
  navigation = [
    { link: 'dashboard', label: 'alb.menu.dashboard' },
    { link: 'feature-list', label: 'alb.menu.features' },
    { link: 'consultations', label: 'alb.menu.consultations' }
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: 'alb.menu.settings' }
  ];

  isAuthenticated$: Observable<boolean> | undefined;
  stickyHeader$: Observable<boolean> | undefined;
  language$: Observable<string> | undefined;
  theme$: Observable<string> | undefined;

  constructor(
    private store: Store<AppState>,
    private storageService: LocalStorageService
  ) {}

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name || '');
  }

  ngOnInit(): void {
    console.log(
      `%c 
      ░█████╗░██╗░░░░░  ██████╗░░█████╗░██╗░░░██╗████████╗░█████╗░██████╗░
      ██╔══██╗██║░░░░░  ██╔══██╗██╔══██╗╚██╗░██╔╝╚══██╔══╝██╔══██╗██╔══██╗
      ███████║██║░░░░░  ██████╦╝███████║░╚████╔╝░░░░██║░░░███████║██████╔╝
      ██╔══██║██║░░░░░  ██╔══██╗██╔══██║░░╚██╔╝░░░░░██║░░░██╔══██║██╔══██╗
      ██║░░██║███████╗  ██████╦╝██║░░██║░░░██║░░░░░░██║░░░██║░░██║██║░░██      
      
       Version 0.0.1 
       Created Created by WebCraftAcademy 2024
            `,
      'color: #00aa00; font-size: 16px; font-family: monospace'
    );
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.navigation = [
          { link: 'dashboard', label: 'alb.menu.dashboard' },
          { link: 'feature-list', label: 'alb.menu.features' },
          { link: 'consultations', label: 'alb.menu.consultations' }
        ];
      } else {
        this.navigation = [
          { link: 'feature-list', label: 'alb.menu.features' }
        ];
      }
    });
  }

  onLoginClick() {
    this.store.dispatch(authLogin());
  }

  onLogoutClick() {
    this.store.dispatch(authLogout());
  }

  onLanguageSelect(event: MatSelectChange) {
    this.store.dispatch(
      actionSettingsChangeLanguage({ language: event.value })
    );
  }
}
