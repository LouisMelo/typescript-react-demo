import * as React from 'react';

// comment: 名字里添加 Interface 可能冗余了，
// 一般可以简单无脑地命名为 `${componentName}Props`，如 HelloProps
interface HelloInterface {
  name?: string;
}

class Hello extends React.Component<HelloInterface> {
  // comment: 这边是默认构造函数的话，一般就不写了
  constructor(props: HelloInterface) {
    super(props);
  }

  render() {
    // :thumbsup
    const { name = 'Anonymous' } = this.props;
    return (
      <div>
        <h1 className="welcome">Hello, {name}!</h1>
      </div>
    );
  }
}

export default Hello;
