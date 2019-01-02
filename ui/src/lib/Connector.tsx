export class Connector {
  public isReady: boolean = false;
  private server: BluetoothRemoteGATTServer | undefined;
  private service: BluetoothRemoteGATTService | undefined;
  private characteristic: BluetoothRemoteGATTCharacteristic | undefined;

  async connect() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: false,
        filters: [{ services: ["0000ffe0-0000-1000-8000-00805f9b34fb"] }]
      });

      if (device && device.gatt) {
        this.server = await device.gatt.connect();
      }

      if (this.server) {
        this.service = await this.server.getPrimaryService(
          "0000ffe0-0000-1000-8000-00805f9b34fb"
        );
      }

      if (this.service) {
        this.characteristic = await this.service.getCharacteristic(
          "0000ffe1-0000-1000-8000-00805f9b34fb"
        );
      }

      if (this.characteristic) {
        await this.characteristic.startNotifications();
      }

      this.isReady = true;
    } catch (err) {
      console.log("[Connector] Error:", err);
    }
  }

  async sendMatrixPattern(hexPattern: string) {
    if (this.characteristic) {
      await this.characteristic.writeValue(this.parseHexString(hexPattern));
    }
  }

  parseHexString(str: string): BufferSource {
    var result = [];
    while (str.length >= 2) {
      result.push(parseInt(str.substring(0, 2), 16));
      str = str.substring(2, str.length);
    }
    return new Uint8Array(result);
  }
}
