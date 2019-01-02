import * as React from "react";
import { Matrix } from "./components/Matrix";
import { css, injectGlobal } from "emotion";
import { Sender } from "./components/Sender";
import { Connector } from "./lib";

injectGlobal`
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

const style = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  height: 100%;
  text-align: center;
`;

type AppProps = {};
type AppState = {
  hex: string;
};

export class App extends React.Component<AppProps, AppState> {
  private connector: Connector;

  constructor(props: AppProps) {
    super(props);

    this.connector = new Connector();

    this.state = {
      hex: ""
    };
  }

  public render() {
    const { hex } = this.state;
    return (
      <div className={style}>
        <Matrix size={8} onChange={this.onMatrixChange} />
        <Sender value={hex} />
      </div>
    );
  }

  private onMatrixChange = async (hex: string) => {
    if (!this.connector.isReady) {
      await this.connector.connect();
    }

    await this.connector.sendMatrixPattern(hex);

    this.setState({
      hex
    });
  };
}
