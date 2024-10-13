import { withPrevious } from "./withPrevious"
import { withState } from "./withState"

const writableWith = {
    with: withState,
    previous: withPrevious,
}

export default writableWith