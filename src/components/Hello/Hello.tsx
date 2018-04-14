import * as React from 'react';

interface HelloInterface {
  name?: string;
}

class Hello extends React.Component<HelloInterface> {
  constructor(props: HelloInterface) {
    super(props);
  }

  render() {
    const { name = 'Anonymous' } = this.props;
    return (
      <div>
        <h1 className="welcome">Hello, {name}!</h1>
      </div>
    );
  }
}

export default Hello;