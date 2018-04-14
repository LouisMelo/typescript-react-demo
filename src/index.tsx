import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// 对应 state, action 等的接口
// 没有使用 payload 的方式
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

interface TodoApp {
  todoList: Todo[];
  visibility: string;
}

interface VisibilityAction {
  type: string;
  filter: string;
}

const todoReducer = function(todo: Todo, action: TodoAction): Todo {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id!,
        text: action.text!,
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

const todoListReducer = function(todoList: Todo[] = [], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD_TODO': 
      return [
        ...todoList,
        {
          id: action.id!,
          text: action.text!,
          completed: false
        } as Todo
      ];
    case 'TOGGLE_TODO': 
      return todoList.map(todo => {
        if (todo.id === action.id!) {
          return todoReducer(todo, action);
        }
        return todo;
      });
    default: 
      return todoList;
  }
};

const visibilityReducer = function(v: string = 'SHOW_ALL', action: VisibilityAction): string {
  switch (action.type) {
    case 'SET_VISIBILITY':
      return action.filter;
    default: 
      return v;
  }
};

// 这里没有用 combineReducer 而是直接手写了
const todoAppReducer = function(todoApp: TodoApp, action: TodoAction & VisibilityAction): TodoApp {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        todoList: todoListReducer(todoApp.todoList, action),
        visibility: visibilityReducer(todoApp.visibility, action)
      };
    case 'TOGGLE_TODO':
      return {
        todoList: todoListReducer(todoApp.todoList, action),
        visibility: visibilityReducer(todoApp.visibility, action)
      };
    case 'SET_VISIBILITY':
      return {
        todoList: todoListReducer(todoApp.todoList, action),
        visibility: visibilityReducer(todoApp.visibility, action)
      };
    default:
      return todoApp;
  }
};

// 自定义的 createStore 方法 但是兼容性较差
const createStore = (reducer: Function) => {
  let state: TodoApp =  {
    todoList: [],
    visibility: 'SHOW_ALL'
  };
  let listeners: Function[] = [];

  const getState = () => {
    return state;
  };

  const dispatch = (action: TodoAction & VisibilityAction) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  const subscribe = (listener: Function) => {
    listeners.push(listener);
  };

  return { getState, dispatch, subscribe };
};

const store = createStore(todoAppReducer);

interface FilterLinkProps {
  filter: string;
  child: string;
  currentFilter: string;
}

const FilterLink = (props: FilterLinkProps) => {
  if (props.filter === props.currentFilter) {
    return <span>{props.child}</span>;
  }
  return (
    <a 
      href="#"
      onClick={(e) => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY',
          filter: props.filter
        });
      }}
    >
      {props.child}
    </a>
  );
};

// helper
const FilteredTodos = (todoList: Todo[], filter: string) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todoList;
    case 'SHOW_ACTIVE':
      return todoList.filter(todo => !todo.completed);
    case 'SHOW_COMPLETED':
      return todoList.filter(todo => todo.completed);
    default: 
      return todoList;
  }
};

let nextId = 0;

class Todo extends React.Component {
  private inputText: HTMLInputElement;
  render() {
    const currentTodoList = FilteredTodos(
      store.getState().todoList,
      store.getState().visibility
    );
    return (
      <div className="container">
        <form className="form-inline">
          <input 
              style={{width: '300px'}}
              className="form-control"
              type="text"
              ref={el => this.inputText = el!}
          />
          <button
            className="btn btn-success"
            onClick={(e) => {
              e.preventDefault();
              store.dispatch({
                type: 'ADD_TODO',
                text: this.inputText.value,
                id: nextId++,
                filter: ''
              });
              this.inputText.value = '';
            }}
          >
            Add Todo
          </button>
        </form>
        <br/>
        <ul className="list-group">
          {
            currentTodoList.map(todo => 
              <li 
                style={{width: '397px'}}
                className={todo.completed ? 'list-group-item list-group-item-secondary' : 'list-group-item'}
                key={todo.id}
                // style={{textDecoration: todo.completed ? 'line-through' : 'none'}}
                onClick={() => {
                  store.dispatch({
                    type: 'TOGGLE_TODO',
                    id: todo.id,
                    filter: ''
                  });
                }}
              >
                {todo.text}
              </li>
            )
          }
        </ul>
        <br/>
        {'Show: '}
        <FilterLink filter="SHOW_ALL" child="全部" currentFilter={store.getState().visibility}/>
        {' | '}
        <FilterLink filter="SHOW_COMPLETED" child="已完成" currentFilter={store.getState().visibility}/>
        {' | '}
        <FilterLink filter="SHOW_ACTIVE" child="待完成" currentFilter={store.getState().visibility}/>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <Todo />,
    document.getElementById('todo')
  );
};

store.subscribe(render);
render();

registerServiceWorker();
