import path from 'path';
import fs from 'fs';

/**
 * 将登录的 qrcode 链接写入文件
 */
export const writeQRCode = (qrcodeImageUrl: string) => {
  const qrcodeFilePath = path.resolve(__dirname, '../qrcode.txt');

  fs.writeFileSync(qrcodeFilePath, JSON.stringify({
    url: qrcodeImageUrl,
    createTime: Date.now(),
  }));
};
