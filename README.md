# pinia-plugin-store

### pinia persistent plugin

[![npm version](https://badge.fury.io/js/pinia-plugin-store.svg)](https://badge.fury.io/js/pinia-plugin-store)
![Alt](https://img.shields.io/npm/dm/pinia-plugin-store)
![Alt](https://img.shields.io/github/license/uinio/pinia-plugin-store)

### install

```shell
npm install pinia-plugin-store
```

### API

| property |              type              |                          description                          |    default     |                                                       
|:--------:|:------------------------------:|:-------------------------------------------------------------:|:--------------:|
|  stores  | (string &Iota; StoreOptions)[] | pinia store keys(specify the store that needs to be persiste) | All Store Keys |
| storage  |            storage             |                      persistent strategy                      |  localStorage  |
| encrypt  |   (value: string) => string    |                     persistent encryption                     |   undefined    |
| decrypt  |   (value: string) => string    |                     persistent decryption                     |   undefined    |

### Example

#### store.ts

```ts

import { createPinia } from 'pinia';
import { storePlugin } from 'pinia-plugin-store';

const store = createPinia();
store.use(storePlugin());

export default store;
```

#### main.ts

```ts
import { createApp } from 'vue';
import store from './store';
import App from './App.vue';

const app = createApp(App);
app.use(store);
app.mount('#app');

```

### Complete Example

##### theme.ts

```ts
import { defineStore } from 'pinia';

export const useThemeStore = defineStore({
  id: 'theme_store',
  state: () => ({
    theme: 'dark',
  }),
  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },
  },
});

```

##### store.ts (Example 1)

###### simple configuration

```ts
import { createPinia } from 'pinia';
import { storePlugin } from 'pinia-plugin-store';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

const store = createPinia();

function encrypt(value: string): string {
  return Base64.stringify(Utf8.parse(value));
}

function decrypt(value: string): string {
  return Base64.parse(value).toString(Utf8);
}

const plugin = storePlugin({
  stores: ['theme_store'],
  storage: localStorage,
  encrypt,
  decrypt,
});

store.use(plugin);

export default store;

```

##### store.ts (Example 2)

###### specify a storage alone

```ts
import { createPinia } from 'pinia';
import { storePlugin } from 'pinia-plugin-store';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

const store = createPinia();

function encrypt(value: string): string {
  return Base64.stringify(Utf8.parse(value));
}

function decrypt(value: string): string {
  return Base64.parse(value).toString(Utf8);
}

const plugin = storePlugin({
  stores: [{ name: 'theme_store', storage: sessionStorage }],
  storage: localStorage,
  encrypt,
  decrypt,
});

store.use(plugin);

export default store;

```

##### store.ts (Example 3)

###### whether encryption is required

```ts
import { createPinia } from 'pinia';
import { storePlugin } from 'pinia-plugin-store';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

const store = createPinia();

function encrypt(value: string): string {
  return Base64.stringify(Utf8.parse(value));
}

function decrypt(value: string): string {
  return Base64.parse(value).toString(Utf8);
}

const plugin = storePlugin({
  stores: [{ name: 'theme_store', isSecretKey: false }],
  storage: localStorage,
  encrypt,
  decrypt,
});

store.use(plugin);

export default store;

```

##### main.ts

```ts
import { createApp } from 'vue';
import store from './store';
import App from './App.vue';

const app = createApp(App);
app.use(store);
app.mount('#app');

```