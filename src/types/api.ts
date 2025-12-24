export interface SyncResult {
  success: boolean;
  synced: number;
  errors: number;
  lastSyncedAt?: string;
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
  };
  error?: string;
}

