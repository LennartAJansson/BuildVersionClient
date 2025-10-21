import { Routes } from '@angular/router';
import { BuildVersionList } from './pages/build-version-list/build-version-list';

export const routes: Routes = [
	{ path: '', component: BuildVersionList },
	// Catch-all -> redirect to start page (build-version-list)
	{ path: '**', redirectTo: '' }
];
