import type { PiniaPlugin, PiniaPluginContext, Store, SubscriptionCallback } from 'pinia';

export interface StoreOptions {
  name: string;
  storage?: Storage;
  ciphertext?: boolean;
}

export type Stores = Array<StoreOptions | string>;

export interface PiniaPersistOptions {
  stores?: Stores;
  storage?: Storage;
  encrypt?: (value: string) => string;
  decrypt?: (value: string) => string;
}

function getState(value?: string) {
  if (value) {
    try {
      return JSON.parse(value) as unknown;
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
  const subscription: SubscriptionCallback<unknown> = (_mutation, state) => {
    const json = JSON.stringify(state);
    storage.setItem(store.$id, encrypt ? encrypt(json) : json);
  };
  store.$subscribe(subscription, { detached: true, deep: true, immediate: true });
}

export function storePlugin(options?: PiniaPersistOptions): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    const getOptions = { ...options };
    const { store } = context;
    const { stores, encrypt, decrypt } = getOptions;
    if (stores && stores.length > 0) {
      stores.forEach((storeKey) => {
        if (typeof storeKey === 'string') {
          if (storeKey === store.$id) {
            const storage = getOptions.storage ?? localStorage;
            createStore(store, { stores, storage, encrypt, decrypt });
          }
        } else if (storeKey.name === store.$id) {
          const { storage, ciphertext } = storeKey;
          const getStorage = () => {
            if (storage) return storage;
            if (getOptions.storage) return getOptions.storage;
            return localStorage;
          };
          createStore(store, {
            stores,
            storage: getStorage(),
            encrypt: ciphertext === false ? undefined : encrypt,
            decrypt: ciphertext === false ? undefined : decrypt,
          });
        }
      });
    }
  };
}
