import { sleep } from "@/tools/tools";
import { lazy } from "react";
export default function Settings(){
    const Temp = lazy(()=>sleep(2000).then(()=>import('@/components/Temp')))
    return <div>
        settings
        <Temp/>
    </div>
}