## commonjs 모듈 타이핑하는 방법과 esModuleInterop

타입스크립트는 기본적으로 `import`, `export`(EMS)를 사용하고,<br />

```ts
import $ from "jquery";
```

노드는 알다시피 `commonjs` 문법을 사용한다.

```ts
const $ = require("jquery");
module.exports = $;
```

그런데 `index.d.ts`에서는 뜬금없이 `export = jQuery`가 나왔다. 이게 뭘까?<br />
바로 타입스크립트에서 commonjs 라이브러리를 표시하는 방법이다.<br />
여기에서는 제이쿼리가 commonjs 방식으로 쓰여졌기 때문에 `export = jQuery` 처럼 쓰여져 있고, 이는 `module.exports = jQuery`와 같다고 보면 된다.<br />
그러면 `const $ = require('jquery');`는 타입스크립트에서 어떻게 표현할까?<br />
`import $ = require('jquery');`로 표현된다.<br />

commonjs와 ESM에 익숙해져 있어도 문법이 저러면 헷갈리기 시작하는데, 이를 하나로 통일할 수 있는 방법이 있다.

```ts
import * as $ from "jquery"; // ✅ 아래 코드와 동일하다.
import $ = require("jquery");
```

### 리액트의 `import React from 'react'`는 잘못됐다? (`esModuleInterop`)

엄밀히 따져보자면 `import React from 'react'`는 잘못된 문법이다.<br />
엄밀히 보자면,<br />

```ts
import * as React from "react";
```

가 되는게 맞다.<br />

리액트의 `index.d.ts`를 살펴보면,

```ts
// ...
export = React; // module.exports = React;

export as namespace React;
// ...
```

> `export = React;`아래 `export as namespace React`가 있어서 엄밀히 말하면 UMD 모듈 시스템이다.

를 확인해볼 수 있다. 그러므로 리액트도 ESM이 아닌, commonjs 모듈인 것이다.<br />
그렇기 때문에 `import React = require('react');`와 같은 식으로 해야하고,<br />
이는 앞서 설명한 것과 같이 `import * as React from 'react'`와 같다.<br />

흔히 사용해오던 `import React from 'react'`가 틀린거라니, 그럼 그 동안 어떻게 사용해오고 있었던건지 싶은 의문이 든다. 여기에서 나오는게 바로 `tsconfig.json`의 `esModuleInterop`이다. 이 옵션이 false면, `import * as React from 'react'`와 같이 써야한다. `* as`를 붙여주기가 번거롭다 보니까 이 옵션을 true로 하는 것이고, 기본값이 true기 때문에 그 동안 잘 사용해오고 있을 수 있었던 것이다.<br />

<br />

### 정리해보자면...

```ts
export = jQuery; // 는 module.exports = jQuery; 과 동일하고 (commonjs)

import $ = require("jquery"); // 타입스크립트에서 이를 사용하는 문법은 이러하며
import * as $ from "jquery"; // 이렇게도 표현이 가능하고,

import $ from "jquery"; // esModuleInterop: true 면 본래 쓰던것과 같이 사용할 수 있는 것.
```

> 이와 같은 흐름을 잘 이해하고 있는 것이 좋다.

그렇다면 모든 라이브러리들이 commonjs로 만들어져 있을까?<br />
그렇지는 않다. ESM으로 만들어진 라이브러리들도 있는데 이는 더 구분하기가 쉽다.<br />

```ts
export default $; // esmodule
export = $; // commonjs

// 가져오는 건 동일하게
import $ from "jquery"; // 로 가져오면 되고
export = $; // commonjs에서는 esModuleInterop: true기 때문에 똑같이 가져오는 형태로 사용할 수 있다.
```

뜬금없어 보이던 `export = jQuery`가 commonjs라는 것을 이해하기 위해 살펴본 여정... 😅<br />

이처럼 코드에 `import $ from 'jquery'` 또는 `export {}` 같은 것이 있고 없고에 따라 파일이 어떻게 인식되는지가 달라지는데, 들어있으면 '모듈시스템'. 없으면 '전역 스크립트'로 인식힌다. '전역 스크립트'로 인식하면, 다른 파일에 타입이 있을거라고 생각해 에러가 발생하지 않는다. 그래서 모듈 시스템으로 만들었다가 타입들이 오히려 꼬일수도 있다.
