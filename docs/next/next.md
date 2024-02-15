
# Rounting 路由
## 文件系统

app 下文件夹，代表 url 路径；如果带括号的文件夹名，则代表 route groups，线路组，不影响 url。

page.tsx: 渲染页，可路由

layout.tsx: 提供一个持久外壳UI，可以用来定义通用结构，切换页面不会remounted

templates.tsx:  也是提供一个外壳UI，也可以用来定义通用结构，但是且路由会 remounted。
> - 可以用来记录 pv，按页反馈表；
> - Suspense 在 layout 里只在首次加载布局时显示 fallback，而对于 template，每次 navigation 时都会显示 fallback。

Metadata: 导出 Metadata 对象，可以修改一些元数据（title、meta）

## link and navigation

Link ：改造版 a 标签

usePathname：获取当前 path

useRouter: 客户端组件中，通过函数，强制跳转。但优先使用 Link 最好。

redirect：服务端组件中，通过函数，跳转导航。例如登录失败，跳转到 login。


> Rounting and Navigation Works，且 性能优化
> 1. 代码分割：next 自动根据路由段，代码分割
> 2. prefetch：Link 组件在视窗可见时，被自动预取；router.prefetch()可以手动开启。
> 3. Router Cache:路由过的内容，会被缓存，尽可能复用。
> 4. 局部渲染：Partial Rendering，layput.tsx能做到。
> 5. 前后导航能保持导航的滚动位置，

## 重定向 redirect

手动重定向：redirect 和 useRouter,NextResponse.redirect in Middleware 

next.config.js,可以直接配置

> Middleware runs after redirects in next.config.js and before rendering.

Next 也提供了[管理大量重定向的解决方案](https://nextjs.org/docs/app/building-your-application/routing/redirecting#managing-redirects-at-scale-advanced)。