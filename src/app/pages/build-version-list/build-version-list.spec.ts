import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BuildVersionList } from './build-version-list';
import { BuildVersionService } from '../../services/build-version.service';
import { MatDialog } from '@angular/material/dialog';
import { BuildVersionDetailDialog } from '../dialogs/build-version-detail-dialog';

describe('BuildVersionList', () => {
  let component: BuildVersionList;
  let fixture: ComponentFixture<BuildVersionList>;
  let svcSpy: jasmine.SpyObj<BuildVersionService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    // Ensure no persisted theme state or classes leak into tests
    localStorage.removeItem('app-theme');
    document.documentElement.classList.remove('dark-theme', 'light-theme');

    svcSpy = jasmine.createSpyObj('BuildVersionService', ['getBuildVersions', 'getByName']);
    svcSpy.getBuildVersions.and.returnValue(of([]));
    svcSpy.getByName.and.returnValue(of(null as any));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    // Ensure the component receives the spy even with standalone imports
    TestBed.overrideProvider(MatDialog, { useValue: dialogSpy });

    await TestBed.configureTestingModule({
      imports: [BuildVersionList],
      providers: [
        { provide: BuildVersionService, useValue: svcSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildVersionList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call service on init and show empty state', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

  expect(svcSpy.getBuildVersions).toHaveBeenCalledTimes(1);
  const el = fixture.nativeElement as HTMLElement;
  // Template renders the full localized empty message
  expect(el.querySelector('.no-data')?.textContent?.trim()).toBe('Ingen data hittades.');
  });

  it('should reload when button is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('#btn-load') as HTMLButtonElement;
    btn.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(svcSpy.getBuildVersions).toHaveBeenCalledTimes(2);
  });

  it('should render table with data and hide internal columns', async () => {
    const item = {
      id: '1',
      projectName: 'ProjA',
      major: 1,
      minor: 0,
      build: 0,
      revision: 0,
      release: '1.0',
      semanticVersion: '1.0.0'
    };
    svcSpy.getBuildVersions.and.returnValue(of([item]));

  fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    // ensure table exists
    expect(el.querySelector('table')).toBeTruthy();
    // headers should include projectName and release but not id/major/minor
    const headers = Array.from(el.querySelectorAll('th')).map((h) => h.textContent?.trim());
    expect(headers).toContain('projectName');
    expect(headers).toContain('release');
    expect(headers).not.toContain('id');
    expect(headers).not.toContain('major');
  });

  it('should show error message when service fails', async () => {
    const err = new Error('server failed');
    svcSpy.getBuildVersions.and.returnValue(throwError(() => err));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

  const el = fixture.nativeElement as HTMLElement;
  // Error text is rendered directly from the error message
  expect(el.querySelector('.error')?.textContent?.trim()).toBe('server failed');
  });

  it('should call getByName and display found version', async () => {
    const item = { id: 'by-1', projectName: 'ByProj', release: '1.0', semanticVersion: '1.0.0' } as any;
    svcSpy.getByName.and.returnValue(of(item));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#projectName') as HTMLInputElement;
    input.value = 'ByProj';
    const btn = fixture.nativeElement.querySelector('#btn-get-by-name') as HTMLButtonElement;
    btn.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(svcSpy.getByName).toHaveBeenCalledWith('ByProj');
    expect(dialogSpy.open).toHaveBeenCalledWith(BuildVersionDetailDialog, jasmine.objectContaining({ data: { version: item } }));
  });

  it('should show error when getByName fails', async () => {
    const err = new Error('not found');
    svcSpy.getByName.and.returnValue(throwError(() => err));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#projectName') as HTMLInputElement;
    input.value = 'NoProj';
    const btn = fixture.nativeElement.querySelector('#btn-get-by-name') as HTMLButtonElement;
    btn.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(dialogSpy.open).toHaveBeenCalledWith(BuildVersionDetailDialog, jasmine.objectContaining({ data: { error: 'not found' } }));
  });

  it('should show a validation dialog when searching with empty name', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#projectName') as HTMLInputElement;
    input.value = '';
    const btn = fixture.nativeElement.querySelector('#btn-get-by-name') as HTMLButtonElement;
    btn.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(dialogSpy.open).toHaveBeenCalledWith(BuildVersionDetailDialog, jasmine.objectContaining({ data: { error: 'Ange projektnamn' } }));
  });
});
