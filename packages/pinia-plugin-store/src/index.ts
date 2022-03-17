import { PiniaPlugin, PiniaPluginContext } from 'pinia';

export interface PiniaPersistOption {
  stores?: string[];
  storage?: Storage;
  encrypt?: (value: string) => string;
  decrypt?: (value: string) => string;
}

function getPiniaState<T = any>(value?: string): T | undefined {
  if (value) return JSON.parse(value);
}

export function storePlugin(options?: PiniaPersistOption): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    if (options) {
      const { store } = context;
      const { storage, encrypt, decrypt, stores } = options;
      const _storage = storage || localStorage;
      if (stores ? stores.includes(store.$id) : true) {
        const session = _storage.getItem(store.$id);
        if (session) {
          const state = getPiniaState(decrypt ? decrypt(session) : session);
          if (state) store.$state = state;
        } else {
          const json = JSON.stringify(store.$state);
          _storage.setItem(store.$id, encrypt ? encrypt(json) : json);
        }
        store.$subscribe((mutation, state) => {
          const json = JSON.stringify(state);
          _storage.setItem(store.$id, encrypt ? encrypt(json) : json);
        });
      }
    }
  };
}
