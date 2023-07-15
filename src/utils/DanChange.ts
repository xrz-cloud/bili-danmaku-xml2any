import X2JS from "x2js";
const x2js = new X2JS();
import { SetConfig } from '@/utils/bilibili_ASS_Danmaku_Downloader.user.js';

interface DIC {
  code: string | number
  data: any
}

const DIC: DIC = {
  'code': '0',
  'data': []
}

type FilterRule = Array<{
  "id": number,
  "mid": number,
  "type": 0 | 1 | 2,
  "filter": string,
  "comment": string,
  "ctime": number,
  "mtime": number
}>

const FilterRule: FilterRule = []

export const xml2json = {
  main: (xml: string): string => {
    return JSON.stringify(x2js.xml2js(xml))
  },
  DPlayer: (json: object | string): string => {
    let dan: any
    if (typeof json == 'object') dan = JSON.stringify(json)
    else dan = json
    dan = JSON.parse(dan)
    const dans: {
      "_p": string,
      "__text": string
    }[] = dan['i']['d']
    for (const x of dans) {
      const p_str = x['_p']
      const p_arr = p_str.split(',')
      let TYPE = 0
      if (p_arr[1] === '4') TYPE = 2
      else if (p_arr[1] === '5') TYPE = 1
      DIC['data'].push([parseFloat(p_arr[0]), TYPE, parseInt(
        p_arr[3]), p_arr[6], x['__text']])
    }
    return JSON.stringify(DIC)
  },
  ArtPlayer: (json: object | string): string => {
    let dan: any
    if (typeof json == 'object') dan = JSON.stringify(json)
    else dan = json
    dan = JSON.parse(dan)
    const dans: {
      "_p": string,
      "__text": string
    }[] = dan['i']['d']
    for (const x of dans) {
      const p_str = x['_p']
      const p_arr = p_str.split(',')
      let TYPE = 0
      if (p_arr[1] === '4') TYPE = 1
      else if (p_arr[1] === '5') TYPE = 1
      DIC['data'].push({
        text: x['__text'],
        time: parseFloat(p_arr[0]),
        color: "#" + (parseInt(p_arr[3])).toString(16),
        border: false,
        mode: TYPE
      })
    }
    return JSON.stringify(DIC)
  }
}

export const json2xml = {
  main: (json: object | string): string => {
    let dan: string
    if (typeof json == 'object') dan = JSON.stringify(json)
    else dan = json
    return '<?xml version="1.0" encoding="UTF-8"?>' + x2js.js2xml(JSON.parse(dan))
  }
}

const x2assConfig = {
  playResX: 1920, // 屏幕分辨率宽（像素）
  playResY: 1080, // 屏幕分辨率高（像素）
  fontlist: [
    // 字形（会自动选择最前面一个可用的）
    "Microsoft YaHei UI",
    "Microsoft YaHei",
    "文泉驿正黑",
    "STHeitiSC",
    "黑体",
  ],
  font_size: 1.0, // 字号（比例）
  r2ltime: 8, // 右到左弹幕持续时间（秒）
  fixtime: 4, // 固定弹幕持续时间（秒）
  opacity: 0.7, // 不透明度（比例）
  space: 0, // 弹幕间隔的最小水平距离（像素）
  max_delay: 6, // 最多允许延迟几秒出现弹幕
  bottom: 50, // 底端给字幕保留的空间（像素）
  use_canvas: null, // 是否使用canvas计算文本宽度（布尔值，Linux下的火狐默认否，其他默认是，Firefox bug #561361）
  debug: false, // 打印调试信息
}

export const xml2ass = {
  main: (xml: string, FileName: string, config: object = x2assConfig): string => {
    return SetConfig(xml, FileName, config)
  }
}

export const json2ass = {
  main: (json: object | string, FileName: string, config: object = x2assConfig): string => {
    return xml2ass.main(json2xml.main(json), FileName, config)
  }
}

export const Filter = {
  xml2json: (xml: string): FilterRule => {
    const _json: { filters: { item: [{ __text: string, _enabled: boolean }] } } = x2js.xml2js(xml)
    for (const x of _json["filters"]["item"]) {
      FilterRule.push({
        id: 0,
        mid: 0,
        type: 1,
        filter: x["__text"].replace("r=", ""),
        comment: "",
        ctime: 0,
        mtime: 0
      })
    }
    return FilterRule
  },
  xml: (Rule: FilterRule, Danmaku_xml: string): string => {
    return json2xml.main(Filter.json.main(Rule, xml2json.main(Danmaku_xml)))
  },
  json: {
    main: (Rules: FilterRule, Danmaku_json: string): string => {
      const danmaku_json = JSON.parse(Danmaku_json)
      let _json = danmaku_json
      let dans: Array<{
        "_p": string,
        "__text": string
      }> = danmaku_json["i"]["d"]
      for (const rule of Rules) {
        for (const i in dans) {
          const dan_all = dans[Number(i)]
          const dan_mes = dan_all["__text"]
          if (dan_mes.match(new RegExp(rule["filter"]))) {
            delete dans[i]
          }
        }
      }
      const dan: Array<{
        "_p": string,
        "__text": string
      }> | undefined = dans
      _json["i"]["d"] = dan.filter(res => { return res != undefined })
      return JSON.stringify(_json)
    }
  }
}
