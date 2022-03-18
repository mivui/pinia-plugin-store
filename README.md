# pinia-plugin-store

### pinia persistent plugin

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

#### api

| property |   type   |      description      |    default     |                                                       
|:--------:|:--------:|:---------------------:|:--------------:|
|  stores  | string[] |  pinia store keys(specify the store that needs to be persiste)   | All Store Keys |
| storage  | storage | persistent strategy  |  localStorage  |
| encrypt  |(value: string) => string | persistent encryption |   undefined    |
| decrypt  | (value: string) => string | persistent decryption |   undefined    |

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

const plugin = storePlugin({
  stores: ['menu_store'],
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