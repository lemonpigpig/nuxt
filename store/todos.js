export const state = () => ({
  list: [
    {done: true, text: 'test'},
    {done: false, text: 'aaaa'}
  ]
})

export const mutations = {
  add (state, text) {
    state.list.push({
      text: text,
      done: false
    })
  },
  delete (state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1)
  },
  toggle (state, todo) {
    todo.done = !todo.done
  }
}
