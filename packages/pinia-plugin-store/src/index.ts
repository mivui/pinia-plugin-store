import { PiniaPlugin, PiniaPluginContext } from 'pinia';

export interface PiniaPersistOption {
  stores?: string[];
  storage?: Storage;
  encrypt?: (value: string) => string;
  decrypt?: (value: string) => string;
}

function defaultFun(value: string): string {
  return value;
}

function getPiniaState<T = any>(value?: string): T | undefined {
  if (value) return JSON.parse(value);
}

export function persistPlugin(options?: PiniaPersistOption): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    if (options) {
      const { store } = context;
      const { storage, encrypt, decrypt, stores } = options;
      const _storage = storage || localStorage;
      const _encrypt = encrypt || defaultFun;
      const _decrypt = decrypt || defaultFun;
      if (stores ? stores.includes(store.$id) : true) {
        const session = _storage.getItem(store.$id);
        if (session) {
          const state = getPiniaState(_decrypt(session));
          if (state) store.$state = state;
        } else {
          _storage.setItem(store.$id, _encrypt(JSON.stringify(store.$state)));
        }
        store.$subscribe((mutation, state) => {
          _storage.setItem(store.$id, _encrypt(JSON.stringify(state)));
        });
      }
    }
  };
}
