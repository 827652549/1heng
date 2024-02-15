'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import Settings from "./settings/page"

const Page = () => {
    const pathname = usePathname()
    const router = useRouter()

    return <>
        <div>
            11111
            <ul className="border-4 border-indigo-500/100">
                <li>
                    <Link href={`/dashboard/settings`}>settings</Link>
                </li>
                <li>
                错误边界:http://localhost:3000/dashboard/error-box
                    {/* <Link href={`/dashboard/settings`}>错误边界</Link> */}
                </li>
                <li>
                    <hr />
                </li>
                <li>
                    <Link href={pathname}>pathname</Link>
                </li>
                <button onClick={()=>{router.push('/router-function')}}>router-function</button>
            </ul>
            {/* 这是个依赖请求渲染的组件，2s 后加载完毕 */}
            <Settings></Settings>
        </div>
    </>
}
export default Page