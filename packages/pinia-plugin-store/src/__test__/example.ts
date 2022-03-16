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

const persist = storePlugin({
  stores: ['menu_store'],
  storage: localStorage,
  encrypt,
  decrypt,
});

store.use(persist);

export default store;
