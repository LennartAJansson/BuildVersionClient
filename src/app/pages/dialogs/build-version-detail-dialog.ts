import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { BuildVersion as BuildVersionResponse } from '../../services/build-version.types';

@Component({
  selector: 'app-build-version-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>

    <mat-dialog-content>
      <div *ngIf="data?.version; else notFound">
        <mat-list>
          <mat-list-item *ngFor="let entry of entries">
            <strong class="key">{{ entry.key }}</strong>
            <span class="value">{{ formatValue(entry.value) }}</span>
          </mat-list-item>
        </mat-list>
      </div>

      <ng-template #notFound>
        <p class="not-found">{{ data?.error || 'Ej funnen' }}</p>
      </ng-template>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Stäng</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .key { width: 160px; display:inline-block; font-weight:600; }
      .value { margin-left: 8px; }
      .not-found { color: var(--mat-sys-error, #b00020); }
    `
  ]
})
export class BuildVersionDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { version?: BuildVersionResponse; error?: string }) {}

  get title(): string {
    return this.data?.version?.projectName ?? (this.data?.error ? 'Resultat' : 'Detaljer');
  }

  get entries(): Array<{ key: string; value: any }> {
    const v = this.data?.version as any | undefined;
    if (!v) return [];
    return Object.keys(v).map((k) => ({ key: k, value: v[k] }));
  }

  formatValue(v: any): string {
    if (v === null) return 'null';
    if (v === undefined) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }
}
// ...removed duplicated block
