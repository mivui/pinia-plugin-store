# pinia-plugin-store

### pinia persistent storage

#### install

```shell
npm install pinia-plugin-store

yarn add pinia-plugin-store
```

## pinia-plugin-store example

#### store.ts

```ts

import { createPinia } from 'pinia';
import { storePlugin } from 'pinia-plugin-store';

const store = createPinia();
store.use(storePlugin()); //all persistent by default

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

#### api

|  property   |   type   |                description                 |                                                         
|:-----------:|:--------:|:------------------------------------------:|
| stores | string[] |              pinia store keys              |
| storage | storage | persistence strategy(default:localStorage) |
| encrypt |(value: T) => string |                   persistent encryption                    |
| decrypt | (value: string) => string |                   persistent decryption                    |

#### complete example

##### menu.ts
```ts
import { defineStore } from 'pinia';

export const useMenuStore = defineStore({
  id: 'menu_store',
  state: () => ({
    collapsed: false,
  }),
  actions: {
    setCollapsed(isCollapsed: boolean) {
      this.collapsed = isCollapsed;
    },
  },
});

```
##### store.ts
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

const persist = storePlugin({
  stores: ['menu_store'],
  storage: localStorage,
  encrypt,
  decrypt,
});

store.use(persist);

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