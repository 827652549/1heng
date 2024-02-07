import { useId } from "react"

export default function UseId() {
    const useid1 = useId()
    const useid2 = useId()
    const useid3 = useId()


    return <div>
        <div>{useid1}</div>
        <div>{useid2}</div>
        <div>{useid3}</div>
    </div>
}