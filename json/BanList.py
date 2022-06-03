#!/usr/bin/python3

import xml.dom.minidom
import json
import re


def xml2json(fpIn):
  "BiliBili弹幕黑名单 XML转JSON"
  DOMTree = xml.dom.minidom.parse(fpIn)
  DIC = []
  collection = DOMTree.documentElement
  bans = collection.getElementsByTagName('item')
  for ban in bans:
    if ban.hasAttribute('enabled') != True:
      return False
    if ban.getAttribute('enabled') != 'true':
      return False
    r = ban.childNodes[0].data
    r = re.sub('([rt]=)', '', r)
    DIC.append({'filter': r})
  return json.dumps(DIC, ensure_ascii=False)


def main():
  fi = xml2json(input("文件路径："))
  f = open(input('新文件保存路径：'), 'w+')
  f.write(fi)
  f.close


if __name__ == '__main__':
  main()
