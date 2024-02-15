import { use } from "react"

export default function ErrorBox(){
    const reason = use(Promise.reject(1))
    return <p>
        ErrorBox
        {reason}
  </p>
}