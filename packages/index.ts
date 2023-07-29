import type { PiniaPlugin, PiniaPluginContext, Store, SubscriptionCallback } from 'pinia';

export interface StoreOptions {
  name: string;
  storage?: Storage;
  ciphertext?: boolean;
}

export type Stores = (string | StoreOptions)[];

export interface PiniaPersistOptions {
  stores?: Stores;
  storage?: Storage;
  encrypt?: (value: string) => string;
  decrypt?: (value: string) => string;
}

function getState<T = any>(value?: string): T | undefined {
  if (value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn(error, 'unknown json format!');
    }
  }
}

interface CreateStoreOptions extends Omit<PiniaPersistOptions, 'storage'> {
  storage: Storage;
}

function createStore(store: Store, options: CreateStoreOptions) {
  const { storage, encrypt, decrypt } = options;
  const session = storage.getItem(store.$id);
  if (session) {
    const state = getState(decrypt ? decrypt(session) : session);
    if (state) store.$state = state;
  } else {
    const json = JSON.stringify(store.$state);
    storage.setItem(store.$id, encrypt ? encrypt(json) : json);
  }
  const subscription: SubscriptionCallback<any> = (_mutation, state) => {
    const json = JSON.stringify(state);
    storage.setItem(store.$id, encrypt ? encrypt(json) : json);
  };
  store.$subscribe(subscription, { detached: true, deep: true, immediate: true });
}

export function storePlugin(options?: PiniaPersistOptions): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    const _options = Object.assign({}, options);
    const { store } = context;
    const { stores, encrypt, decrypt } = _options;
    if (stores && stores.length > 0) {
      stores.forEach((storeKey) => {
        if (typeof storeKey === 'string') {
          if (storeKey === store.$id) {
            const storage = _options.storage || localStorage;
            createStore(store, { stores, storage, encrypt, decrypt });
          }
        } else if (storeKey.name === store.$id) {
          const { storage, ciphertext } = storeKey;
          const _storage = () => {
            if (storage) return storage;
            if (_options.storage) return _options.storage;
            return localStorage;
          };
          createStore(store, {
            stores,
            storage: _storage(),
            encrypt: ciphertext === false ? undefined : encrypt,
            decrypt: ciphertext === false ? undefined : decrypt,
          });
        }
      });
    }
  };
}
