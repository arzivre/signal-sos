import { proxy, useSnapshot } from 'valtio'


interface StateSelectSignal {
  index: number
  selectIndex: (id: number) => void
}

const state = proxy<StateSelectSignal>({
  index: 0,
  selectIndex: (id: number) => {
    state.index = id
  },
})

export default function useSelectSignal() {
  return useSnapshot(state)
}
