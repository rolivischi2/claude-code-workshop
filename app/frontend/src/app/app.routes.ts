import { Routes } from '@angular/router';
import { OfficeList } from './offices/office-list';
import { OfficeDetail } from './offices/office-detail';
import { DeclarationForm } from './declaration-form/declaration-form';

export const routes: Routes = [
  { path: '', component: OfficeList, title: 'Zollstellen' },
  { path: 'offices/:code', component: OfficeDetail, title: 'Zollstelle' },
  { path: 'offices/:code/declare', component: DeclarationForm, title: 'Transitanmeldung erfassen' },
  { path: '**', redirectTo: '' },
];
