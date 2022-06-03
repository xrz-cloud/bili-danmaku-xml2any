#!/usr/bin/python3

import xml.dom.minidom
import json


def xml2json(fpIn):
    "BiliBili弹幕 XML转JSON(dplayer格式)"
    DIC = {
        'code': '0',
        'data': [],
        'HEAD': {
            'chatserver': '',
            'chatid': '',
            'mission': '',
            'maxlimit': '',
            'state': '',
            'real_name': '',
            'source': '',
        }
    }
    DOMTree = xml.dom.minidom.parse(fpIn)
    collection = DOMTree.documentElement
    DIC['HEAD']['chatserver'] = collection.getElementsByTagName('chatserver')[
        0].childNodes[0].data
    DIC['HEAD']['chatid'] = collection.getElementsByTagName('chatid')[
        0].childNodes[0].data
    DIC['HEAD']['mission'] = collection.getElementsByTagName('mission')[
        0].childNodes[0].data
    DIC['HEAD']['maxlimit'] = collection.getElementsByTagName('maxlimit')[
        0].childNodes[0].data
    DIC['HEAD']['state'] = collection.getElementsByTagName('state')[
        0].childNodes[0].data
    DIC['HEAD']['real_name'] = collection.getElementsByTagName('real_name')[
        0].childNodes[0].data
    DIC['HEAD']['source'] = collection.getElementsByTagName('source')[
        0].childNodes[0].data
    dans = collection.getElementsByTagName('d')
    for dan in dans:
        if dan.hasAttribute('p'):
            p_str = dan.getAttribute('p')
            p_arr = p_str.split(',')
            TYPE = 0
            if p_arr[1] == '4':
                TYPE = 2
            elif p_arr[1] == '5':
                TYPE = 1
            DIC['data'].append([float(p_arr[0]), TYPE, int(
                p_arr[3]), p_arr[6], dan.childNodes[0].data])
    return json.dumps(DIC, ensure_ascii=False)


def main():
    fi = xml2json(input("文件路径："))
    f = open(input('新文件保存路径：'), 'w+')
    f.write(fi)
    f.close


if __name__ == '__main__':
    main()
