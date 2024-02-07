#  TS case 手册（归纳类）

## 等级划分

1. **初级 TypeScript**：此阶段的开发者应掌握 TypeScript 的基础知识，包括：
    - 理解和使用基本类型（`number`、`string`、`boolean`、`null`、`undefined`和`any`)。
    - 了解函数、接口和类的类型注解和定义方法。
    - 熟悉基本的泛型和枚举类型。

2. **中级 TypeScript**：此阶段的开发者应该能够适应大部分工作场景，包括：
    - 在项目中使用 TypeScript 并理解 `tsconfig.json` 文件配置。
    - 使用高级类型（`&`、`|`、`type`）和索引类型（`keyof`、`T[K]`）。
    - 对工具类型(`Partial`、`Readonly`、`Pick`、`Exclude`、`Omit` 等)和条件类型（`T extends U ? X : Y`）有深入理解。
    - 使用装饰器和命名空间。
    - 了解如何在项目中整合 TypeScript 和 JavaScript。
    - 理解在同一个项目中使用 TypeScript 和 JavaScript 的最佳实践，如何添加类型声明文件 `.d.ts` 来给 JavaScript 代码添加类型支持。

3. **高级 TypeScript**：此阶段的开发者开始对 TypeScript 的底层逻辑有一些初步了解，包括：
    - 深入理解 TypeScript 类型系统和类型推导。理解内置类型的工作原理，理解 TypeScript 如何推断变量和函数返回值的类型。
    - 理解并能够利用映射类型、条件类型以及keyof等进行高级类型操作。
    - 能够创建和使用自己的工具类型。例如创建一个工具类型将某个类型的所有属性都转换成可选属性。
    - 对 AST（抽象语法树）有基本了解：这对于编写 TypeScript 插件或者使用工具如 Babel 进行源码转换非常有用。

4. **大神级别 TypeScript**：此阶段的开发者可以利用 TypeScript 构建复杂的项目和库，他们具备以下技能：
    - 熟练使用 TypeScript 类型系统进行复杂的类型操作和推断。实现一些常见的编程概念，比如 `Promise`、`Partial`、`Required` 等。
    - 能够定制和扩展 TypeScript 的编译环境并使用 AST（抽象语法树）处理 TypeScript 代码。
    - 编写和维护复杂的声明文件：能够为没有提供 TypeScript 支持的 JavaScript 库创建 `.d.ts` 声明文件。
    - 可以针对特定问题设计和实现自己的 TypeScript 工具库，例如，创建用于表单验证、数据转换或者状态管理的类型安全工具库。
## 热身

### case 1：基本类型

```typescript
// 类型固定
type Test1 = number | string
// 值固定
type Test2 = "apple" | "banana"
// 只读
type Test3 = readonly boolean
```

### case 2：元组、数组
as const 相当于 JS 中 Object.freeze()，不过 js 中的这个是浅冻结，as const 是深度冻结

```typescript
// 元组
const tuple1 = [1, "1"] as const
const tuple2: readonly [number, string] = [1, "1"]
// 数组
type arr1 = [string, ...boolean[], number]
type arr2 = number[];
```

### case 3： 函数

```typescript
// 函数声明阶段
type add = (a: number, b: number) => number
// 回调函数，例如 map 的回调，返回值是 People
(name): People => ({ name })
```

### case 4：interface 和 type
同名 interface 会合并，type 扩展需要 &

### case 5: 命名冲突
当前文件加这句代码，将文件视为模块，解决全局命名冲突
```typescript
export {}
```

### case 6：keyof
返回 key 的联合（|）
```typescript
type People = {
    age: string,
    name: number,
    say: () => void
}
// 'age' | 'name' | 'say'
type keys = keyof People 
```

### case 7：extends
```typescript
type Test1<T extends string> = T // 必须是 string
type Test2<T extends {
    age:number,
    name:string
}> = T
type Test3 = 1 extends number ? true : false;

// 如果 extends 左边的 T 是个联合类型，条件运算符就会展开
(A|B) extends U ? X : Y

// 等同于

(A extends U ? X : Y) |
(B extends U ? X : Y)

// 如果不想展开，把 extends 两侧放到方括号里面
// 示例一
type ToArray<Type> =
  Type extends any ? Type[] : never;

// string[]|number[]
type T = ToArray<string|number>;

// 示例二
type ToArray<Type> =
  [Type] extends [any] ? Type[] : never;

// (string | number)[]
type T = ToArray<string|number>;

```

### case 8：严格模式
严格模式，除了 strict 外，noImplicitAny 和 strictNullChecks 是两个比较重要的选项。

### case 9： 注释
@ts-expect-error：期望异常

## 入门
### Pick、in 和 []
in: 遍历

[]: 代表取出，类似 map.get(key)，如果 key 是键的类型（number、string 等，则代表取出对应类型的值）

```typescript
// 实现 Pick
type MyPick<> = {
    [key in K]:T[key]
}
// cases
interface Todo {
  title: string
  description: string
  completed: boolean
}
MyPick<Todo, 'title'>
MyPick<Todo, 'title' | 'completed'>
```

### 元组转对象
```typescript
type TupleToObject<T extends readonly (number|string|symbol)[]> = {
  [key in T[number]]:key
}
const tupleNumber = [1, 2, 3, 4] as const
<TupleToObject<typeof tupleNumber>, { 1: 1, 2: 2, 3: 3, 4: 4 }>
```

### 数组第一位

```typescript
type First<T extends any[]> = T extends [] ? never : T[0]
type First<T extends any[]> = T['length'] extends 0 ? never : T[0]
type First<T extends any[]> = T extends [infer A, ...infer rest] ? A : never

type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

### 元组长度

```typescript
type Length<T extends readonly any[]> = T['length']

type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

### Exclude，实现排除

```typescript
// 利用 联合类型 T 配合 entends 展开
type MyExclude<T, U> = T extends U ? never : T
```

### Awaited

```typescript
T extends PromiseLike<infer U> ? 
    U extends PromiseLike<any> ?
     MyAwaited<U> : U 
: never
```

### IF

```typescript
type If<C extends boolean, T, F> = C extends true ? T : F 
```

### Concat

```typescript
type Concat<T extends readonly unknown[], U extends readonly unknown[]> = [...T,...U]
```
### includes
对于遍历，通过 extends 和 [inter First,... inter Rest]配合递归来取
```typescript
type Includes<T extends readonly any[], U> = T extends [infer First,...infer Rest] ?
  Equal<U,First> extends true ? true :
    Includes<Rest,U>:
    false
```

### Push
```typescript
type Push<T extends unknown[], U> = [...T,U]
```

### Unshift
```typescript
type Unshift<T extends unknown[], U> = [U,...T]
```

### Parameters 获取所有参数类型
```typescript
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P ) => any ? P : never
```

### 获取函数返回值的类型
```typescript
type MyReturnType<T> = T extends (...args:any)=>infer R ? R:never
```