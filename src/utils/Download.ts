// Copy from https://tiansh.github.io/us-danmaku/bilibili/bilibili_ASS_Danmaku_Downloader.user.js
// @author      田生
// @copyright   2014+, 田生
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// 将js修改以适用于ts

// 创建下载
export function startDownload(data: string, filename: string) {
  const blob = new Blob([(data)], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const saveas = document.createElement('a');
  saveas.href = url;
  saveas.style.display = 'none';
  document.body.appendChild(saveas);
  saveas.download = filename;
  saveas.click();
  setTimeout(function () { if (saveas.parentNode) { saveas.parentNode.removeChild(saveas); } }, 1000)
  document.addEventListener('unload', function () { window.URL.revokeObjectURL(url); });
};