import { InjectionToken } from '@angular/core';
import { FirebaseApp, getApp } from 'firebase/app';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { FIREBASE_APPS } from '../app/provider';
import { NgFireFeatureFn } from '../app/types';

// ---------------------------------------------------------------------------
// Injection Tokens
// ---------------------------------------------------------------------------

/**
 * All registered Storage instances.
 */
export const STORAGE_INSTANCES = new InjectionToken<FirebaseStorage[]>(
  'NgFire.StorageInstances'
);

/**
 * The default Storage instance.
 */
export const STORAGE = new InjectionToken<FirebaseStorage>('NgFire.Storage');

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function defaultStorageFactory(
  providedInstances: FirebaseStorage[]
): FirebaseStorage {
  return providedInstances.length === 1
    ? providedInstances[0]
    : getStorage(getApp());
}

// ---------------------------------------------------------------------------
// withStorage()
// ---------------------------------------------------------------------------

export interface StorageConfig {
  bucketUrl?: string;
}

/**
 * Register a Storage instance for the current app.
 *
 * Depends on `FIREBASE_APPS` to guarantee the app is initialized
 * before `getApp()` is called.
 *
 * @example
 * ```typescript
 * provideNgFire(config, withStorage({ bucketUrl: 'gs://my-custom-bucket' }))
 * ```
 */
export function withStorage(config?: StorageConfig): NgFireFeatureFn {
  return (appName?: string) => [
    {
      provide: STORAGE_INSTANCES,
      multi: true,
      deps: [FIREBASE_APPS],
      useFactory: (_apps: FirebaseApp[]) =>
        getStorage(getApp(appName), config?.bucketUrl),
    },
    {
      provide: STORAGE,
      deps: [STORAGE_INSTANCES],
      useFactory: defaultStorageFactory,
    },
  ];
}
