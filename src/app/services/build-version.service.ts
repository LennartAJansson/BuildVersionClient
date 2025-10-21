import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BuildVersion,
  CreateBuildVersionDto,
  UpdateBuildVersionDto,
  BuildVersionServiceFeaturesInfoAppResponse,
  BuildVersionServiceFeaturesBuildVersionsIncreaseRequest,
  FastEndpointsErrorResponse
} from './build-version.types';

@Injectable({ providedIn: 'root' })
export class BuildVersionService {
  private readonly http = inject(HttpClient);
  // Base URL comes from Angular environment (configurable per build)
  private readonly base = (environment && environment.buildVersionApiBaseUrl) ? environment.buildVersionApiBaseUrl.replace(/\/+$/, '') : 'https://buildversionservice.local';

  // Optional: call setAuthToken to include Authorization: Bearer <token> on requests
  private authToken: string | null = null;
  setAuthToken(token: string | null): void { this.authToken = token; }

  private defaultHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Accept': 'application/json' });
    if (this.authToken) headers = headers.set('Authorization', `Bearer ${this.authToken}`);
    return headers;
  }

  // --- Info
  getAppInfo(): Observable<BuildVersionServiceFeaturesInfoAppResponse> {
    const url = `${this.base}/info/app`;
    return this.http.get<BuildVersionServiceFeaturesInfoAppResponse>(url, { headers: this.defaultHeaders() });
  }

  // --- BuildVersions collection
  getBuildVersions(): Observable<import('./build-version.types').GetBuildVersionsResponse> {
    const url = `${this.base}/buildversions`;
    return this.http.get<BuildVersion[]>(url, { headers: this.defaultHeaders() });
  }

  createBuildVersion(dto: CreateBuildVersionDto): Observable<import('./build-version.types').CreateBuildVersionResponse> {
    const url = `${this.base}/buildversions`;
    return this.http.post<BuildVersion>(url, dto, { headers: this.defaultHeaders() });
  }

  updateBuildVersion(id: string, dto: UpdateBuildVersionDto): Observable<import('./build-version.types').UpdateBuildVersionResponse> {
    const url = `${this.base}/buildversions/${encodeURIComponent(id)}`;
    return this.http.put<BuildVersion>(url, dto, { headers: this.defaultHeaders() });
  }

  deleteBuildVersion(id: string): Observable<import('./build-version.types').DeleteBuildVersionResponse> {
    const url = `${this.base}/buildversions/${encodeURIComponent(id)}`;
    return this.http.delete<void>(url, { headers: this.defaultHeaders() });
  }

  increaseBuildVersion(req: BuildVersionServiceFeaturesBuildVersionsIncreaseRequest): Observable<import('./build-version.types').IncreaseBuildVersionResponse> {
    const url = `${this.base}/buildversions/increase`;
    return this.http.post<BuildVersion>(url, req, { headers: this.defaultHeaders() });
  }

  getByName(projectName: string): Observable<import('./build-version.types').GetBuildVersionByIdResponse> {
    const url = `${this.base}/buildversions/by-name/${encodeURIComponent(projectName)}`;
    return this.http.get<BuildVersion>(url, { headers: this.defaultHeaders() });
  }

  getById(id: string): Observable<import('./build-version.types').GetBuildVersionByIdResponse> {
    const url = `${this.base}/buildversions/by-id/${encodeURIComponent(id)}`;
    return this.http.get<BuildVersion>(url, { headers: this.defaultHeaders() });
  }

  // --- Convenience endpoints
  getHealth(): Observable<any> {
    const url = `${this.base}/health`;
    return this.http.get<any>(url, { headers: this.defaultHeaders() });
  }

  // Map FastEndpointsErrorResponse for error handling by consumers if needed
  /** Utility to convert an error payload to typed FastEndpointsErrorResponse if present */
  parseError(body: any): FastEndpointsErrorResponse | null {
    if (!body || typeof body !== 'object') return null;
    const maybe = body as FastEndpointsErrorResponse;
    if (typeof maybe.statusCode === 'number' && typeof maybe.message === 'string') return maybe;
    return null;
  }
}
