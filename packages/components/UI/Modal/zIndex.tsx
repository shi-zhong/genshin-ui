const map = new Map<symbol, number>()

let lastone: symbol = Symbol()

const mount = (sym: symbol) => {
  const max = map.get(lastone) || 0
  map.set(sym, max + 1)
  lastone = sym
  return max + 1
}

const unmount = (sym: symbol) => {
  map.delete(sym)
  if (sym === lastone) {
    // 移除最后一个元素
    const keys = [...map.keys()]
    lastone = keys[map.size - 2]
  }
}

const count = () => map.size

export { mount, unmount, count }
