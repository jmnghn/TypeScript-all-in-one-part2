## @types/jquery 설치하기

<br />

### @types/jquery의 index.d.ts

```ts
// Type definitions for jquery 3.5
// Project: https://jquery.com
// Definitions by: Leonard Thieu <https://github.com/leonard-thieu> // <기여자 목록>
//                 Boris Yankov <https://github.com/borisyankov>
//                 ...
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.7 // <타입스크립트 2.7 이상부터 사용이 가능하다.>

/// <reference types="sizzle" />
/// <reference path="JQueryStatic.d.ts" />
/// <reference path="JQuery.d.ts" />
/// <reference path="misc.d.ts" />
/// <reference path="legacy.d.ts" />
//
// 여기서 참조하고 있는 ts들을 적어놓은 것.
//
// <reference 종류>
// - types: npm 라이브러리
// - path: 현재 라이브러리 파일
// - lib: TS 기본 제공 라이브러리
//
// @types/sizzle은 @types/jquery 설치 시 같이 설치되어 node_modules 안에 들어가있게 된다.
//
// 이처럼 index.d.ts(package.json의 "types" 또는 "typing")을 먼저 보는것이 좋고,
// 왜 무엇을 참조하고 있는지를 알아야 하냐면,
// 마지막 라인에 있는 export = jQuery에 타입이 없을수도 있기 때문이다.

export = jQuery;
// 위 코드를 보면서 들 수 있는 궁금증으로는
// export = jQuery 말고는 다 주석인데, jQuery는 대체 어디서 온걸까? 하는 점이다.
// 음... 아직 어디서 선언된지는 모르겠지만, 이 ts파일에서 참조하고 있는 것들중에서 가져올 것이라는 것을 추측해볼 수 있다.
```
