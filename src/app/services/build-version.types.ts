/*
 * Trimmed types for BuildVersion API used by the client.
 * Keep only the commonly-used fields, plus an index signature to accept additional props.
 */

export enum BuildVersionServiceCoreVersionPart {
  Major = 0,
  Minor = 1,
  Build = 2,
  Revision = 3
}

export interface BuildVersion {
  id: string;
  projectName: string;
  major: number;
  minor: number;
  build: number;
  revision: number;
  version?: string | null;
  shortVersion?: string | null;
  release?: string | null;
  semanticVersion?: string | null;
  // accept additional properties without failing strict typing
  [key: string]: any;
}

export interface CreateBuildVersionDto {
  projectName: string;
  major?: number;
  minor?: number;
  build?: number;
  revision?: number;
  semanticVersionText?: string | null;
}

export interface UpdateBuildVersionDto {
  // Partial update payload for fields we allow updating
  projectName?: string;
  major?: number;
  minor?: number;
  build?: number;
  revision?: number;
  semanticVersionText?: string | null;
}

export interface BuildVersionServiceFeaturesBuildVersionsIncreaseRequest {
  projectName: string;
  part?: BuildVersionServiceCoreVersionPart | number;
}

export interface BuildVersionServiceFeaturesInfoAppResponse {
  assemblyName?: string | null;
  semanticVersion?: string | null;
  buildTime?: string | null; // date-time
}

export interface FastEndpointsErrorResponse {
  statusCode?: number;
  message?: string;
  errors?: Record<string, string[]>;
}

// Aliases preserved for the service implementation
// CRUD-style request/response aliases to make the API surface explicit
export type GetBuildVersionsResponse = BuildVersion[];
export type GetBuildVersionByIdResponse = BuildVersion;

export type CreateBuildVersionRequest = CreateBuildVersionDto;
export type CreateBuildVersionResponse = BuildVersion;

export type UpdateBuildVersionRequest = UpdateBuildVersionDto;
export type UpdateBuildVersionResponse = BuildVersion;

export type DeleteBuildVersionResponse = void;

export type IncreaseBuildVersionRequest = BuildVersionServiceFeaturesBuildVersionsIncreaseRequest;
export type IncreaseBuildVersionResponse = BuildVersion;

// Keep legacy alias names (compat)
export type CreateBuildVersionDtoAlias = CreateBuildVersionDto;
export type UpdateBuildVersionDtoAlias = UpdateBuildVersionDto;

