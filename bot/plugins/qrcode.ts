import { ScanStatus, Wechaty, WechatyPlugin } from 'wechaty';
import qrTerminal from 'qrcode-terminal';
import { isDev } from '../../helper/env';

interface IQRCodeCallbackProps {
  qrcode: string;

  // 扫码状态
  status: ScanStatus;
}

interface IQRCodeProps {
  small?: boolean;
  callback?: ({ qrcode, status }: IQRCodeCallbackProps) => void;
}

export function QRCode ({
  callback,
}: IQRCodeProps = {}): WechatyPlugin {
  return function QRCodePlugin (wechaty: Wechaty) {
    wechaty.on('scan', function onScan (qrcode: string, status: ScanStatus) {
      if (isDev) {
        qrTerminal.generate(qrcode, {
          small: true,
        })
      }

      callback?.({
        status,
        qrcode,
      });
    })
  }

}