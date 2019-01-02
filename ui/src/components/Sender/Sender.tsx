import * as React from "react";
import { css } from "emotion";

const style = css`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 500px;
`;

type SenderProps = {
  value: string;
};

export class Sender extends React.Component<SenderProps> {
  public render() {
    const { value } = this.props;
    return (
      <div className={style}>
        <p>{value}</p>
        <button onClick={this.onSend}>send</button>
      </div>
    );
  }

  private onSend = async () => {
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"]
      });
      console.log(device.name);

      // Attempts to connect to remote GATT Server.
      const server = await device.gatt.connect();
      // console.log("server", server);
      const service = await server.getPrimaryService(
        "0000ffe0-0000-1000-8000-00805f9b34fb"
      );
      // console.log("service", service);
      const characteristic = await service.getCharacteristic(
        "0000ffe1-0000-1000-8000-00805f9b34fb"
      );
      console.log("characteristic", characteristic);
      const startResult = await characteristic.startNotifications();
      console.log("startNotifications", startResult);
      const encoder = new TextEncoder();
      console.log(
        "Sending",
        this.props.value,
        this.parseHexString(this.props.value)
      );

      const resultCha = await characteristic.writeValue(
        this.parseHexString(this.props.value)
      );
      console.log("resultCha", resultCha);
    } catch (err) {
      console.log(err);
    }
  };

  parseHexString(str: string) {
    var result = [];
    while (str.length >= 2) {
      result.push(parseInt(str.substring(0, 2), 16));

      str = str.substring(2, str.length);
    }

    return new Uint8Array(result).buffer;
  }
}
