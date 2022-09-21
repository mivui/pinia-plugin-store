import {
  Store,
  PiniaPlugin,
  PiniaPluginContext,
  SubscriptionCallback,
} from 'pinia';

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

function isJSON(value: string) {
  return /^\{+([^/]{0,})\}$/.test(value) || /^\[+([^/]{0,})\]$/.test(value);
}

function getState<T = any>(value?: string): T | undefined {
  if (value) {
    if (isJSON(value)) return JSON.parse(value);
    console.warn('unknown json format!');
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
  const subscription: SubscriptionCallback<any> = (mutation, state) => {
    const json = JSON.stringify(state);
    storage.setItem(store.$id, encrypt ? encrypt(json) : json);
  };
  store.$subscribe(subscription, { detached: true, deep: true });
}

export function storePlugin(options?: PiniaPersistOptions): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    const _options = options || {};
    const { store } = context;
    const { stores, encrypt, decrypt } = _options;
    if (stores && stores.length > 0) {
      stores.forEach((storeKey) => {
        if (typeof storeKey === 'string') {
          if (storeKey === store.$id) {
            const storage = _options.storage || localStorage;
            createStore(store, { stores, storage, encrypt, decrypt });
          }
        } else if (storeKey && storeKey.name === store.$id) {
          const { storage, ciphertext } = storeKey;
          createStore(store, {
            stores,
            storage: storage || _options.storage || localStorage,
            encrypt: ciphertext === false ? undefined : encrypt,
            decrypt: ciphertext === false ? undefined : decrypt,
          });
        }
      });
    }
  };
}
