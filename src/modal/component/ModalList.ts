import Observer from '../lib/Observer';

class ModalList extends Observer {
  createMarkup(state) {
    return `<ul>
    ${state.todos.map(todo => `<li>${todo.value}</li>`).join("\n")}
    </ul>`
  }

  render(state, selector = "app") {
    console.log('render markupt from modalist', state)
    const markup = this.createMarkup(state['todos']);
 
    const parent = document.getElementById(selector);
    parent.innerHTML = markup;
  }

  update(state) {
    this.render(state, "modal-todos")
  }
};

export default ModalList;