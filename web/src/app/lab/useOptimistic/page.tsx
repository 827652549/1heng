'use client'
import { useEffect, useOptimistic, useState } from "react"

const NoUseOptimistic = function NoUseOptimistic() {
    const [data, setValue] = useState(0)

    async function handle() {
        setValue(10)
        await new Promise((resolve => {
            setTimeout(() => {
                resolve(1)
            }, 2000)
        }))
        setValue(20)
    }
    return <div>
        {data}
        <hr />
        <button onClick={handle}>click</button>
    </div>
}

export default function UseOptimistic() {
    const [data, setValue] = useState('')
    const [optimisticValue, addOptimisticValue] = useOptimistic(data,
        (currentState, optimisticValue: any) => {
            return optimisticValue
        }
    )

    async function handle() {
        addOptimisticValue(' Pending……乐观值占位')

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

