
import { ReleaseNote } from "./release";

export interface SaveReleaseResponse {
  success: boolean;
  error?: string;
}

export interface DeleteReleaseResponse {
  success: boolean;
  error?: string;
}

export interface ReleasesApi {
  fetchReleases: () => Promise<ReleaseNote[]>;
  saveRelease: (release: Partial<ReleaseNote>) => Promise<SaveReleaseResponse>;
  deleteRelease: (id: string) => Promise<DeleteReleaseResponse>;
}
