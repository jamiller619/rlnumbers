import { State, useStore } from '~/store'

const selector = ({ isWindowFocused }: State) => isWindowFocused

export default function useWindowFocus() {
  return useStore(selector)
}
