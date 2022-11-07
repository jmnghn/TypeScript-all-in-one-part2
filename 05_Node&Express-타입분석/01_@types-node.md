## @types/node

<br />

### `window.setTimeout`과 node의 `setTimeout`

```ts
window.setTimeout(() => {}, 1000); // 리턴 타입이 number

// lib.dom.d.ts
setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
```

```ts
setTimeout(() => {}, 1000); // 리턴 타입이 NodeJS.Timeout

// timers.d.ts
```

> 노드의 타이머는 조금 다르다.

<br />

### 앰비언트(ambient) 모듈

#### `fs`, GTD.

```ts
declare module 'fs' {
    import * as stream from 'node:stream';
    ...
```

타입선언만 있고 구현이 없는 것을 앰비언트라고 한다.<br />
`declare module ...`과 같은 것을 앰비언트(ambient) 모듈이라고 한다.<br />

왜 다른라이브러리들은 `declare module`를 사용하지 않았을까?<br />
라이브러리에 해당하는 패키지 말고는 다른 타입이 없었기 때문.<br />

하지만 `@types/node`에서는 이런 모듈들이 너무 많아 사용했다.

```ts
declare module "http" { ... }
declare module 'path' { ... }
...
```

<br />

#### 그리고 처음 보는... 😅

```ts
...
declare module "node:fs" {
  export * from "fs"; // 위에 선언한 fs모듈에서 export한 모든 것들을 가져오겠다. 복사붙여넣기 느낌~
}
```

`node:`는 node.js 진영에서도 좀 더 권장하는 문법이다.

```ts
import fs = require("node:fs");
import http = require("node:http");
import path = require("node:path");
```

그리고 esModuleInterop이 true라서 ESM 방식으로 import해올 수 있다.

```ts
import fs from "fs";
import http from "http";
import path from "path";
```

<br />

### 샘플코드 실행

```
$ npx ts-node node.ts
서버 시작됨
```
