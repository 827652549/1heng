'use client'
import SlowList from "@/components/SlowList"
import { SetStateAction, useDeferredValue, useId, useState } from "react"

export default function Page() {
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const deferText = useDeferredValue(text2)

    function handleTextChange(e: { target: { value: SetStateAction<string> } }) {
        setText1(e.target.value)
    }
    function handleDeferTextChange(e: { target: { value: SetStateAction<string> } }) {
        setText2(e.target.value)
    }
    return <div>
        <h1>useDeferredValue Demo</h1>
        <p>优化耗时渲染组件</p>
        <div className="columns-2">
            <div>
                <p>常规 useState 的值，长耗时会阻塞 UI 渲染</p>
                <div>
                    <span>非 defer 值：</span>
                    <input className="text-black"
                        type="text" value={text1} onChange={handleTextChange} />
                </div>
                <SlowList title="非 defer 值" text={text1} />
            </div>
            <div>
                <p> useDeferredValue 的值，尽可能快速反馈用户操作，又保持流畅。</p>
                <div>
                    <span>defer 值：</span>
                    <input className="text-black"
                        type="text" value={text2} onChange={handleDeferTextChange} />
                </div>
                <SlowList title="defer 值" text={deferText} />
            </div>

        </div>
    </div>

}