import * as React from "react";
import { css } from "emotion";

const wrapperStyle = css`
  position: relative;
  margin: 0;
`;

const style = css`
  &:checked,
  &:not(:checked) {
    position: absolute;
    visibility: hidden;
  }

  &:checked + label,
  &:not(:checked) + label {
    display: flex;
    width: 24px;
    height: 24px;
    border: 1px solid red;
    cursor: pointer;
  }

  &:checked + label {
    background-color: red;
  }
`;

type MatrixLedProps = {
  rowIndex: number;
  ledIndex: number;
  isActive: boolean;
  onClick(x: number, y: number): void;
};

export class MatrixLed extends React.Component<MatrixLedProps> {
  public render() {
    const { rowIndex, ledIndex, isActive } = this.props;

    return (
      <div className={wrapperStyle}>
        <input
          id={`${rowIndex}-${ledIndex}`}
          className={style}
          type="checkbox"
          name={`${rowIndex}-${ledIndex}`}
          value={`${rowIndex}-${ledIndex}`}
          checked={isActive}
          onChange={this.onChange}
        />
        <label htmlFor={`${rowIndex}-${ledIndex}`} />
      </div>
    );
  }

  private onChange = () => {
    const { onClick, rowIndex, ledIndex } = this.props;

    onClick(ledIndex, rowIndex);
  };
}
