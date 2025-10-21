import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BuildVersionService } from '../../services/build-version.service';
import { BuildVersion as BuildVersionResponse } from '../../services/build-version.types';
import { Subject, Observable, of } from 'rxjs';
import { startWith, switchMap, map, catchError, shareReplay } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BuildVersionDetailDialog} from '../dialogs/build-version-detail-dialog';

@Component({
  selector: 'app-build-version-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  MatDialogModule,
  BuildVersionDetailDialog,
  MatCardModule,
  MatButtonModule
  ],
  templateUrl: './build-version-list.html',
  styleUrls: ['./build-version-list.scss']
})
export class BuildVersionList {
  // Use a stable, injected service reference (single responsibility)
  private readonly service = inject(BuildVersionService);

  // Trigger to reload the list on demand
  private readonly reload$ = new Subject<void>();
  // Previously we exposed a selected$ stream backed by byName$; results are now shown in a dialog
  // Columns to hide from the UI (kept in the data, just not displayed)
  private readonly hiddenColumns = new Set<string>(['id', 'major', 'minor', 'build', 'revision']);

  // Public view-model observable consumed with the async pipe in the template
  readonly vm$: Observable<{
    loading: boolean;
    error: string | null;
    versions: BuildVersionResponse[];
    displayedColumns: string[];
  }> = this.reload$.pipe(
    startWith<void>(undefined),
    switchMap(() => this.service.getBuildVersions().pipe(
      map((payload: any) => {
        // The v1 API is typed to return an array. Keep a small, predictable normalization step
        const versions: BuildVersionResponse[] = Array.isArray(payload) ? payload : [];
        const displayedColumns = versions.length ? this.computeVisibleColumns(versions[0]) : [];
        return { loading: false, error: null, versions, displayedColumns };
      }),
      catchError((err) => of({ loading: false, error: err?.message || String(err), versions: [], displayedColumns: [] })),
      startWith({ loading: true, error: null, versions: [], displayedColumns: [] }),
      shareReplay({ bufferSize: 1, refCount: true })
    ))
  );

  // Dialog service for showing result dialogs
  private readonly dialog = inject(MatDialog);

  // (Dialog component is loaded dynamically when needed)

  /** Trigger a manual reload of the list (bound to the UI). */
  loadFromBuildVersions(): void {
    this.reload$.next();
  }

  /** Initiate a search for a build version by project name */
  searchByName(name?: string | null): void {
    const n = name ? String(name).trim() : '';
    if (!n) {
      this.dialog.open(BuildVersionDetailDialog, { data: { error: 'Ange projektnamn' } as any });
      return;
    }

    this.service.getByName(n).subscribe({
      next: (version) => this.dialog.open(BuildVersionDetailDialog, { data: { version } as any }),
      error: (err) => this.dialog.open(BuildVersionDetailDialog, { data: { error: err?.message || 'Ej funnen' } as any })
    });
  }

  /** Compute which columns should be visible for a given item. */
  private computeVisibleColumns(item?: BuildVersionResponse): string[] {
    if (!item || typeof item !== 'object') return [];
    return Object.keys(item).filter((k) => !this.hiddenColumns.has(k.toLowerCase()));
  }

  /** trackBy function for table rows to improve rendering performance */
  trackById(_index: number, item: BuildVersionResponse): string | number {
    return (item && (item as any).id) || _index;
  }
}
