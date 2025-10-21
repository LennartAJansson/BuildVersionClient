import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BuildVersionService } from './build-version.service';
import { environment } from '../../environments/environment';

describe('BuildVersionService', () => {
  let svc: BuildVersionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Reset persisted theme state to avoid side-effects from other tests
    localStorage.removeItem('app-theme');
    document.documentElement.classList.remove('dark-theme', 'light-theme');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuildVersionService]
    });

    svc = TestBed.inject(BuildVersionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /buildversions', () => {
    const mock: any[] = [];
    svc.getBuildVersions().subscribe((res) => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${environment.buildVersionApiBaseUrl}/buildversions`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush(mock);
  });

  it('should include Authorization when token is set', () => {
    svc.setAuthToken('my-token');
    svc.getBuildVersions().subscribe();

    const req = httpMock.expectOne(`${environment.buildVersionApiBaseUrl}/buildversions`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush([]);
  });

  it('should POST to /buildversions on create', () => {
    const dto = { projectName: 'P' };
    svc.createBuildVersion(dto as any).subscribe();

    const req = httpMock.expectOne(`${environment.buildVersionApiBaseUrl}/buildversions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ id: '1', projectName: 'P' });
  });

  it('should PUT to /buildversions/:id on update', () => {
    const dto = { projectName: 'P' };
    svc.updateBuildVersion('abc', dto as any).subscribe();

    const req = httpMock.expectOne(`${environment.buildVersionApiBaseUrl}/buildversions/abc`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);
    req.flush({ id: 'abc', projectName: 'P' });
  });

  it('should DELETE /buildversions/:id on delete', () => {
    svc.deleteBuildVersion('del-id').subscribe();
    const req = httpMock.expectOne(`${environment.buildVersionApiBaseUrl}/buildversions/del-id`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should POST to /buildversions/increase', () => {
    const reqBody = { projectName: 'P', part: 1 };
    svc.increaseBuildVersion(reqBody as any).subscribe();
    const req = httpMock.expectOne(`${environment.buildVersionApiBaseUrl}/buildversions/increase`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reqBody);
    req.flush({ id: 'new', projectName: 'P' });
  });

  it('should GET by-name and by-id with correct urls', () => {
    svc.getByName('MyProject').subscribe();
    let req = httpMock.expectOne(`${environment.buildVersionApiBaseUrl}/buildversions/by-name/MyProject`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: '1', projectName: 'MyProject' });

    svc.getById('GUID').subscribe();
    req = httpMock.expectOne(`${environment.buildVersionApiBaseUrl}/buildversions/by-id/GUID`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'GUID', projectName: 'MyProject' });
  });

  it('should encode projectName when calling getByName', () => {
    const name = 'My Project/With Space#?&';
    svc.getByName(name).subscribe((res) => {
      expect(res.projectName).toBe(name);
    });

    const expectedUrl = `${environment.buildVersionApiBaseUrl}/buildversions/by-name/${encodeURIComponent(name)}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'enc-1', projectName: name });
  });
});
