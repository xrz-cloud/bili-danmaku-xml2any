#!/usr/bin/env python3
# import urllib.request
from gzip import GzipFile
from io import StringIO
import zlib


""" def loadData(url):
    request = urllib.request.Request(url)
    request.add_header('Accept-encoding', 'gzip,deflate')
    response = urllib.request.urlopen(request)
    content = response.read()
    encoding = response.info().get('Content-Encoding')
    if encoding == 'gzip':
        content = gzip(content)
    elif encoding == 'deflate':
        content = deflate(content)
    return content """


def gzip(data):
    buf = StringIO(data)
    f = gzip.GzipFile(fileobj=buf)
    return f.read()


def deflate(data):
    try:
        return zlib.decompress(data, -zlib.MAX_WBITS)
    except zlib.error:
        return zlib.decompress(data)


""" def main():
    url = "http://www.xxx.com/"
    content = loadData(url)
    print(content) """


def main():
    fp = input("文件路径：")
    f = open(fp, 'rb')
    fi = deflate(f.read())
    f.close()
    del f
    save_mode_create = input('是否保存至新文件[是(y)/否(n)]：')
    if save_mode_create == 'n':
        f = open(fp, 'wb')
    elif save_mode_create == 'y':
        f = open(input('新文件保存路径：'), 'wb')
    f.write(fi)
    f.close


if __name__ == '__main__':
    main()
