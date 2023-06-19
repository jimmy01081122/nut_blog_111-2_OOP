const { config } = require('@wipi/config');
const cli = require('next/dist/cli/next-start');

const port = config.CLIENT_PORT || 3001;

try {
  cli.nextStart(['-p', port]);
  console.log(`[系統] 用戶端已啟動，埠：${port}`);
} catch (err) {
  console.log(`[系統] 用戶端啟動失敗！${err.message || err}`);
}
