import axios from "axios";

const state = {
  todos: []
};
// we want to get the todos from our Application-level state (storage) to our actual Vue component that needs to use it
const getters = {
  allTodos: state => state.todos
};
//When you create an action it takes an object, you can destructure it to use what you needs from it e.g. commit => which is used to call mutations
const actions = {
  async fetchTodos({ commit }) {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
    commit("setTodos", res.data);
  },
  async addTodo({ commit }, title) {
    const res = await axios.post("https://jsonplaceholder.typicode.com/todos", {
      title,
      completed: false
    });
    commit("newTodo", res.data);
  },
  async deleteTodo({ commit }, id) {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    commit("removeTodo", id);
  },
  async filterTodos({ commit }, e) {
    // Get selected value
    const limit = parseInt(
      e.target.options[e.target.options.selectedIndex].innerText
    );
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`
    );
    //same mutation as fetch but since data is already coming back with limit it displays only that amount
    commit("setTodos", res.data);
  },
  async updateTodo({ commit }, updTodo) {
    //pass in the id of the todo to update + the updTodo object coming from our component
    const res = await axios.put(
      `https://jsonplaceholder.typicode.com/todos/${updTodo.id}`,
      updTodo
    );
    console.log(res.data);
    commit("updateTodo", res.data);
  }
};
// mutations are what actually updates the state not an action!
const mutations = {
  setTodos: (state, todos) => (state.todos = todos),
  newTodo: (state, todo) => state.todos.unshift(todo), //unshift same as push but at beginning not end
  removeTodo: (state, id) =>
    (state.todos = state.todos.filter(todo => todo.id !== id)),
  updateTodo: (state, updTodo) => {
    const index = state.todos.findIndex(todo => todo.id === updTodo.id);
    if (index !== -1) {
      state.todos.splice(index, 1, updTodo);
    }
  }
};
//  remember ES6, same name so no need for state:state, getters:getters....
export default {
  state,
  getters,
  actions,
  mutations
};
