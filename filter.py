#!/usr/bin/python3

import re
import json


def filter(dansFileInfo, filterFile='filter.json'):
  "BiliBili弹幕过滤"

  with open(filterFile, 'r') as f:
    filters = json.load(f)

  dansFileInfo = json.loads(dansFileInfo)
  dans = dansFileInfo['data']
  i = 0
  for filterRule in filters:
    for dan in dans:
      danMessage = dan[4]
      if re.search(filterRule['filter'], danMessage):
        print('处理弹幕', dan)
        print('过滤关键词', filterRule['filter'])
        dans.remove(dan)
        i += 1
        print('过滤弹幕条数', i)
        print('----------')
        continue
  dansFileInfo['data'] = dans
  return json.dumps(dansFileInfo, ensure_ascii=False)


def main():
  fp = input("文件路径：")
  f = open(fp, 'r')
  fi = filter(f.read())
  f.close()
  del f
  save_mode_create = input('是否保存至新文件[是(y)/否(n)]：')
  if save_mode_create == 'n':
    f = open(fp, 'w+')
  elif save_mode_create == 'y':
    f = open(input('新文件保存路径：'), 'w+')
  f.write(fi)
  f.close


if __name__ == '__main__':
  main()
