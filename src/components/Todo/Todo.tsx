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
  // comment: 就目前的程序结构来看，这个 switch...case 有些冗余，
  // 简单点，为 ADD_TODO 和 TOGGLE_TODO 这两个操作的 reducer helper 写
  // 独立的函数也可以；毕竟，在 todosReducer 里已经做好 switch...case
  // 判断，也就是说，调用的地方，已经明确知道该用这里的 ADD_TODO 还是
  // TOGGLE_TODO 逻辑了。
  //
  // 但，理解有层级地使用 reducer 很好 :)
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
      // :thumbsup 用 map 创建具有新引用且浅拷贝的数组
      return todos.map(t => {
        if (t.id !== action.id) { // comment: 这边应该是 === 还是 !== ？
          return todoReducer(t, action);
        }
        return t;
      });
    // :thumbsup 在收到未定义的 action 时，有定义的 store 更新（不变）很好
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

  // :thumbsup 也可以试试把 unsubscribe 的功能引入到这个 app 里，
  // 在组件 unmount 的时候 unsubscribe
  const subscribe = (listener: Function) => {
    listeners.push(listener);
  };

  return { getState, dispatch, subscribe };
};
// set the store
const store = createStore(todosReducer);

// TODOs:
// - 实现 toggle
// - 实现两个列表（未完成，已完成）
// - 有空的话，支持放弃（删除 todo）功能
const TodoApp = () => {
  // comment: 可以试着把 nextId 以及创建新 todo 的逻辑提出，到一个独立的
  // 带闭包的函数里。
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
