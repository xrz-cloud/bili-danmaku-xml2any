export function EXT(FileName: string) {
  //输入文件名，返回后缀(扩展名)
  return (FileName.split('.').pop() || 'Null');
}
export function FNeEXT(FileName: string) {
  //输入文件名，返回文件名(除去扩展名)
  return FileName.substring(0, FileName.lastIndexOf("."))
}
interface FT_zh {
  [key: string]: string
}
export function EXT2FT_zh(FileName: string) {
  //提供文件名，返回文件类型(中文)
  const FT_zh: FT_zh = {
    'xml': 'B站原生弹幕文件',
    'json': '其他播放器弹幕文件',
    'ass': '视频字幕或弹幕文件'
  }
  const ext = EXT(FileName)
  if (ext == "Null") return '未知文件'
  if (!FT_zh[ext]) return '未知文件'
  return FT_zh[ext]
}
export function FTC(FileName: string, Exts: Array<string>): boolean {
  //输入文件名，检测其后缀是否匹配提供数组.
  //例：FTC('a.txt',['txt','json','ass'])  输出 true
  //例：FTC('a.txt',['json','xml','ass'])  输出 false
  const extension = FileName.split('.').pop();
  let x: string | undefined
  for (x in Exts) {
    if (extension == Exts[x]) return true
  }
  return false
}