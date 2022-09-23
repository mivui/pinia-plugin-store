import { createPinia } from 'pinia';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';
import { storePlugin } from '..';

const store = createPinia();

function encrypt(value: string): string {
  return Base64.stringify(Utf8.parse(value));
}

function decrypt(value: string): string {
  return Base64.parse(value).toString(Utf8);
}

const plugin = storePlugin({
  stores: ['theme_store', { name: 'user_store', storage: sessionStorage }],
  storage: localStorage,
  encrypt,
  decrypt,
});

store.use(plugin);

export default store;
