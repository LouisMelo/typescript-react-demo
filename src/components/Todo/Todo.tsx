import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoAction {
  type: string;
  id?: number;
  text?: string;
}

// todo reducer
const todoReducer = (todo: Todo, action: TodoAction) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      } as Todo;
    case 'TOGGLE_TODO':
      return {
        ...todo,
        completed: !todo.completed
      } as Todo;
    default:
      return todo;
  }
};

interface TodosAction {
  type: string;
  id?: number;
  text?: string;
}

// todos reducer
const todosReducer = (todos: Todo[], action: TodosAction) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...todos,
        todoReducer({} as Todo, action)
      ];
    case 'TOGGLE_TODO':
      return todos.map(t => {
        if (t.id !== action.id) {
          return todoReducer(t, action);
        }
        return t;
      });
    default:
      return todos;
  }
};

// interface VisibleAction {
//   type: string;
//   filter?: string;
// }
// visible reducer
// const visible = (v = "SHOW_ALL", action: VisibleAction) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.filter;
//     default:
//       return v;
//   };
// };

// craeteStore
const createStore = (reducer: Function) => {
  let state: Todo[] = [];
  let listeners: Function[] = [];

  const getState = () => {
    return state;
  };

  const dispatch = (action: TodosAction) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  const subscribe = (listener: Function) => {
    listeners.push(listener);
  };

  return { getState, dispatch, subscribe };
};
// set the store
const store = createStore(todosReducer);

const TodoApp = () => {
  let nextId = 0;
  return (
    <div>
      <button 
        onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          text: 'Test',
          id: nextId++
        });
      }}
      >
        Add Todo
      </button>
      <ul>
        {store.getState().map(todo => 
          <li 
            key={todo.id}
          >
            {todo.text}
          </li>
        )}
      </ul>
    </div>
  );
};

const render = () => {
  ReactDOM.render(
    <TodoApp />,
    document.getElementById('todo')
  );
};

store.subscribe(render);
render();
