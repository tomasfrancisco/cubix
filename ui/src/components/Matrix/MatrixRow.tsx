import * as React from "react";
import { css } from "emotion";
import { MatrixLed } from "./MatrixLed";

const style = css`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

type MatrixRowProps = {
  rowIndex: number;
  ledCount: number;
  rowLedState: boolean[];
  onLedClick(x: number, y: number): void;
};

export class MatrixRow extends React.Component<MatrixRowProps> {
  public render() {
    const { rowIndex, ledCount, rowLedState, onLedClick } = this.props;

    return (
      <div className={style}>
        {[...Array(ledCount)].map((_, ledIndex) => (
          <MatrixLed
            key={`row-${rowIndex}-led-${ledIndex}`}
            rowIndex={rowIndex}
            ledIndex={ledIndex}
            isActive={rowLedState[ledIndex]}
            onClick={onLedClick}
          />
        ))}
      </div>
    );
  }
}
