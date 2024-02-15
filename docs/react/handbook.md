# 手册

## Hook

### use （实验）
读 Promise 和 Context

可以使用 if

### useDeferredValue

延迟版的响应式数据，底层是对 lane 优先级降级，

例子：input 组件，绑定大量需要渲染的节点
```tsx
 const [text,setText] = useState('')
 const deferText = useDeferredValue(text)
 ...
 return <>
    {text},{deferText}
 </>
```
对于 text, 输入变动后立刻以新值渲染

对于 deferText, 先使用旧值渲染，再使用新值渲染。但是如果在渲染新值前又发生了变化，则UI还能保持旧值。在带动大批量渲染时更容易触发这种延迟效果。

虽然防抖和节流也能处理这种情况，但是防抖节流的速度取决于传入的 delay 值，而 useDeferredValue 的速度取决于对后续渲染的计算能力，会根据设备性能动态计算。

useDeferredValue 在需要尽可能快速反馈用户操作同时又需要进行复杂计算或渲染的情况下，useDeferredValue 可以使应用保持流畅，提高用户体验。

### useTransition

类似 useDeferredValue ，主要为 set 函数标记 transition。而针对于 props 和自定义 hook 值，则使用 useDeferredValue。

```tsx
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

总是会输出 1,2,3，回调函数里面是同步代码，一定是立即执行，只是将里面的 page 的状态的改变，放到 transition 阶段，对应的 UI 更新不会立即执行。好处是，可以避免阻塞主线程，保证用户交互等高优先级任务及时响应。

useTransition()将UI更新标记为低优先级，这种操作对大量的非紧急更新非常有用。

当你调用 startTransition(() => setPage('/about')) 时，你实际上是在告诉 React：“我现在打算改变页面，但是如果有其他更紧急的事情需要做（比如响应用户的点击或者渲染新的 UI），那就先去做那些事情。待一切都处理好了，再回来把页面更新了吧。”
>  **useDeferredValue 和 useTransition 区别**
>
> useDeferredValue: 
> 
> **频繁更新同一个状态时**，可能导致后续 UI 频繁变化，但是又不想让 UI 变化本身阻塞用户的输入体验。防抖或许能解决，但是 delay 过长会觉得页面响应慢，过短可能又会影响输入体验，而如果需要一个临界最优解，则可以通过 useDeferredValue。
>
> useTransition:
>
> 意识到**某一个 setXXX 状态更新，会带来长时间的 UI 变化**，但期间用户可能要做其他的事件，如点击和滚动之类的。那就可以通过 useTransition 将这个状态更新的降低到一个低优先级阶段。
>
> ---
> 二者可以独立使用，也可以搭配使用
>
> 如果你只是获取数据并更新 UI，没有涉及到频繁的状态改变，那么只使用 useTransition 就足够了。同样，如果你只是处理频繁的状态更新，比如一个实时的搜索框，没有涉及到显著的 UI 更新，那么只使用 useDeferredValue 也足够。
>
> 但是，您不应该开始使用 startTransition 来结束所有状态更新。仅当您的用户界面较慢时才使用它，尤其是在旧设备上，或者在您没有其他解决方案可使用的情况下。这是因为它占用了额外的性能。
>
> 

### useId

生成唯一 ID

比如你想要连接 HTML 元素，比如 label 和 input。

useId 生成的字符串ID，第一个字符是冒号，最后一个字符也是冒号，如果是服务端渲染生成的ID，则会使用大写字母 R 作为标识，如果是客户端渲染生成的ID，则会使用小写字母 r 作为标识。

useId 生成字符串ID时，会使用一个全局变量来记录 useId 在页面中出现的次数，因此，即使 useId 在页面中出现多次，生成的 ID 也不会冲突。

### useImperativeHandle 和 forwardRef

forwardRef 有点类似 vue emit 的行为，将子 ref 暴露给父组件中。如果需要暴露指定的 dom 方法，或自定义方法，可以通过 useImperativeHandle 约束某些指定方法，让暴露给父组件的 ref 仅获取到需要的方法。

```tsx
//App.js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}

//MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;

```

### useOptimistic （实验）

UI 体验上的优化，先提前占位响应结果，等服务器响应后替换占位。

```tsx

export default function UseOptimistic() {
    const [data, setValue] = useState('')
    const [optimisticValue, addOptimisticValue] = useOptimistic(data,
        (currentState, optimisticValue: any) => {
            return optimisticValue
        }
    )

    async function handle() {
        addOptimisticValue('Pending……乐观值占位')

        const result: string = await new Promise((resolve => {
            setTimeout(() => {
                resolve('server data')
            }, 2000)
        }))

        setValue(result)

    }

    return <div>
        <p>当点击 click 时，可以先用某个值占位，然后等结果返回后，再替换占位。</p>
        <p>这样可以给用户更好的体验</p>
        <hr />
        <form action={handle}>
            {optimisticValue}
            <br />
            <button type="submit">click fetch</button>
        </form>
    </div>
}
```

### <Fragment/>

<></> 是 <Fragment></Fragment>的缩写，后者可以加入 key

### <Profiler>

测量每次触发 render 的时机和性能分析

```tsx
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>

function onRender(
    id, // App
    phase, // mount | update | nested-update
    actualDuration, // 当前 render 耗时
    baseDuration, // 估计不进行任何优化的情况下，重渲染整个树的耗时
    startTime,  // 开始渲染的时间戳
    commitTime // 提交当前更新的时间戳
    ) {
  // Aggregate or log render timings...
}
```

### <StrictMode/>

开启严格模式

会开启双重渲染，以识别不纯的函数组件。
- 组件函数体。仅顶层逻辑，不包括事件处理函数。
- 传递给 useState、set function、useMemo or useReducer 的函数
- 一些类组件方法。constructor、render、shouldComponentUpdate

### <Suspense/>

悬念，可当做 loading 组件的引入方式

只有 Suspense-enabled data 才会激活 Suspense 组件：
- Suspense-enabled 框架，包括 Next 和 Relay
- lazy 组件
- use 读取 Promise 的值

不会检测 Effect 和 event handler。

startTransition 或 useDeferredValue 可以让更新避开 Suspense 的重新激活。

利用 Suspense 可以，实现Streaming Render & Selective Hydration，Streaming Render是流式渲染，S 向 C 逐步渲染 HTML；Selective Hydration 选择性水合，React 能根据用户交互情况，优先选择那些组件进行交互。

## 基础概念

### 'use client' 和 'use server'

未明确指出 'use client'，默认是服务器组件。

### the render tree 和 the module dependency tree

渲染树，当前呈现的组件树。
> The render tree only encapsulates components.

模块依赖树，需要按照依赖关系导出的树
> The nodes that make-up the tree represent modules, not components.


渲染树是模块依赖树的子集

The Render Tree
![render tree](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fconditional_render_tree.dark.png&w=640&q=75)

The Module Dependency Tree
![The Module Dependency Tree](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fmodule_dependency_tree.dark.png&w=750&q=75)

### createPortal

提供一个 DOM 注入 JSX 组件的方法，而并完全在 div#root 内。

使用场景：1. 注入页面已存在 DOM 节点，比如地图 API 小组件 DOM。; 2. 脱离父 class 的控制

```tsx
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

### flushSync

强制同步刷新，DOM 会被变更。

> React will immediately call this callback and flush any updates it contains synchronously. It may also flush any pending updates, or Effects, or updates inside of Effects.

### hydrate 和 hydrateRoot （客户端 API）
React17:hydrate
React18:hydrateRoot

### render 和 renderRoot （客户端 API）
React17:render
React18:renderRoot

### pre*
```tsx
// 预解析 DNS 服务器地址
prefetchDNS("https://example.com");
// 预解析资源主机服务器地址
preconnect("https://example.com");
```

以下 API 可能不需要手动调用，React-based frameworks 会为你处理。
```tsx
// 预下载，且执行
// for stylesheet or external script
preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
// for ESM module
preinitModule("https://example.com/module.js", {as: "script"});

// 预下载，但不执行，保存到缓存中 
//for xxx. eg：stylesheet, font, or external script 
preload("https://example.com/font.woff2", {as: "font"});
// 预下载，但不执行，for ESM module
preloadModule("https://example.com/module.js", {as: "script"});

```
### renderToPipeableStream、renderToReadableStream （服务端 API）
都是流式传输

renderToPipeableStream，renders a React tree to a [**pipeable Node.js Stream**](https://nodejs.org/api/stream.html).
renderToReadableStream，renders a React tree to a [**Readable Web Stream**](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

### renderToStaticMarkup、renderToString （服务端 API）
都是 render to HTML string

renderToStaticMarkup：for non-interactive App，cannot be hydrated
renderToString：for interactive App， 然后在客户端上 hydrateRoot 配合水合。

### renderToStaticNodeStream、renderToPipeableStream （服务端 API）

renderToStaticNodeStream：for 非交互式应用，无法水合
renderToPipeableStream：for 交互式应用，客户端上使用 hydrateRoot 配合水合。