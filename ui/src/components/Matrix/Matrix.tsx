import * as React from "react";
import { MatrixRow } from "./MatrixRow";

type MatrixProps = {
  size: number;
  onChange(hex: string): void;
};

type MatrixState = {
  ledState: boolean[][];
};

export class Matrix extends React.Component<MatrixProps, MatrixState> {
  constructor(props: MatrixProps) {
    super(props);

    const ledState = [...Array(props.size)].map(() =>
      [...Array(props.size)].fill(false)
    );

    this.state = {
      ledState
    };
  }

  public render() {
    const { size } = this.props;
    const { ledState } = this.state;

    return [...Array(size)].map((_, rowIndex) => (
      <MatrixRow
        key={`row-${rowIndex}`}
        rowIndex={rowIndex}
        ledCount={size}
        rowLedState={ledState[rowIndex]}
        onLedClick={this.onLedClick}
      />
    ));
  }

  private onLedClick = (x: number, y: number) => {
    const { onChange } = this.props;
    const { ledState } = this.state;

    ledState[y][x] = !ledState[y][x];

    this.setState(
      {
        ledState
      },
      () => onChange(this.ledStateToHex())
    );
  };

  private ledStateToHex() {
    const { ledState } = this.state;
    let binaryMatrix: string[] = [];

    ledState.forEach(row => {
      let rowByte: Array<1 | 0> = [];
      row.forEach(led => {
        rowByte.push(led ? 1 : 0);
      });
      rowByte.reverse();
      const intValue = parseInt(rowByte.join(""), 2).toString(16);
      const stringValue = ("0" + intValue).substr(-2); // Keep left 0 in case it exists
      binaryMatrix.push(stringValue);
    });

    return binaryMatrix.reverse().join("");
  }
}
