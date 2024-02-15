import { syncLongTimeConsumeTask } from "@/tools/tools"
import { useMemo } from "react"

type SlowListProps = {
    title: string,
    text: string
}
/**
 * 慢列表组件
 * @returns 
 */
const SlowList =
    function SlowList({ title, text }: SlowListProps) {
        console.log('<SlowList> 慢组件', title)
        const items = useMemo(() => {
            const tmpItems = []
            for (let i = 0; i < 250; i++) {
                tmpItems.push(<SlowItem key={i} title={title} text={text} />)
            }
            return tmpItems
        }, [title, text])
        return <div>
            {items}
        </div>
    }

const SlowItem = ({ title, text }: SlowListProps) => {
    syncLongTimeConsumeTask(1000)
    return <li>
        {title}:{text}
    </li>
}
export default SlowList