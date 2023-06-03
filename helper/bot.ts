import shell from 'shelljs';

export const stop = () => {
  return new Promise((resolve) => {
    shell.exec('pm2 delete index', () => {
      resolve(1);
    });
  });
};
