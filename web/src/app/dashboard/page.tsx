import { use } from "react"

const Page = () => {

    const v = use(Promise.resolve([1, 23, 3]))
    console.log(v)

    return <>
        <div>11111

        </div>
    </>
}
export default Page