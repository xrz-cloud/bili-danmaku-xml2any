<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElNotification, genFileId } from "element-plus";
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  ButtonType,
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { xml2ass, json2ass } from "@/utils/DanChange";
import { FTC, EXT, EXT2FT_zh, FNeEXT } from "@/utils/FileTypeCheck";
import { startDownload } from "@/utils/Download";

const DanmakuType = ref<string | undefined>("无");
interface B_ {
  type: ButtonType;
  isDisabled: boolean;
}
const B_default: B_ = { type: "", isDisabled: true };
const B_xml2ass = ref<B_>(B_default);
const B_json2ass = ref<B_>(B_default);

const DanmakuFile = ref("");
const FN = ref(""); //文件名(去扩展名)
const FE = ref(""); //生成的文件的扩展名
const Dconfig = reactive({
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
});

const loading = ref(false);

const upload = ref<UploadInstance>();

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const openFile = (file: any) => {
  const B_abled: B_ = { type: "success", isDisabled: false };
  B_xml2ass.value = B_default;
  B_json2ass.value = B_default;
  DanmakuType.value = "无";
  const reader = new FileReader();
  reader.onload = function () {
    if (!reader.result) return false;
    if (!FTC(file["name"], ["xml", "json", "txt"])) return false;
    const ft = EXT2FT_zh(file["name"]),
      ext = EXT(file["name"]);
    FN.value = FNeEXT(file["name"]);
    DanmakuType.value = ft;
    if (ext == "xml") {
      FE.value = "ass";
      B_xml2ass.value = B_abled;
    } else if (ext == "json") {
      FE.value = "ass";
      B_json2ass.value = B_abled;
    }
    DanmakuFile.value = reader.result.toString(); //读取值
    /*const json = xml2json(FileInfo);
    const json_dplayer = dplayer(json);
    console.log(json_dplayer);*/
  };
  reader.readAsText(file.raw);
};
function Change(File: string, Action: string) {
  const filename = FN.value || "danmaku";
  ElNotification({
    title: "提示",
    message: "转换需大约5s，大文件需更多时间。",
  });
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 5000);
  if (Action == "xml2ass") {
    startDownload(
      xml2ass.main(File, filename, Dconfig),
      filename.replace(/\.[^.]*$/, "") + ".ass"
    );
    return false;
  }
  if (Action == "json2ass") {
    startDownload(
      json2ass.main(File, filename, Dconfig),
      filename.replace(/\.[^.]*$/, "") + ".ass"
    );
    return false;
  }
}
</script>
<template>
  <h2>0. 使用须知</h2>
  <p>
    请确保所选文件为正确弹幕文件，否则可能转换失败。<br />
    由于为浏览器本地处理，上传大文件可能会造成卡顿甚至崩溃。<br />
  </p>
  <p>
    当前页面所提供的B站弹幕XML转ASS功能使用<el-link
      type="primary"
      target="_blank"
      href="//github.com/tiansh/"
      >田生</el-link
    >的<el-link
      type="primary"
      target="_blank"
      href="//tiansh.github.io/us-danmaku/bilibili/bilibili_ASS_Danmaku_Downloader.user.js"
      >脚本</el-link
    >，来源于<el-link
      type="primary"
      target="_blank"
      href="//tiansh.github.io/us-danmaku/bilibili"
      >bilibili ASS 弹幕在线转换</el-link
    >。<br />
    现建议使用其新版转换器，<el-link
      type="success"
      target="_blank"
      href="//tiansh.github.io/ass-danmaku-online/"
      >跳转</el-link
    >。
  </p>
  <div v-loading="loading" element-loading-text="等待转换完成后在更改文件！">
    <h2>1. 上传弹幕文件</h2>
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      :auto-upload="false"
      :limit="1"
      :on-exceed="handleExceed"
      :on-change="openFile"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖动文件至此 或 <em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-red">
          请选择弹幕文件，如：.xml 、.json 。
        </div>
      </template>
    </el-upload>
  </div>
  <el-divider />
  <div
    v-loading="loading"
    element-loading-text="正在转换中，请稍后，将在10s内完成"
  >
    <h2>2. 填写配置 选择转换模式</h2>
    弹幕类型：{{ DanmakuType }}
    <el-divider />
    <p>
      为确保弹幕能正常填充屏幕，达到原效果，请填写适用视频分辨率<br />
      分辨率：
      <el-input-number v-model="Dconfig['playResX']"></el-input-number> x
      <el-input-number v-model="Dconfig['playResY']"></el-input-number>
    </p>
    <el-table
      :data="[
        ['1920x1080', '1080P'],
        ['1280x720', '720P'],
        ['560x420', '420P'],
      ]"
      border
      style="width: 100%"
    >
      <el-table-column prop="0" label="分辨率" />
      <el-table-column prop="1" label="格式(逐行扫描下)" />
    </el-table>
    <el-divider />
    字幕区高度[底端给字幕保留的空间(像素)]：
    <el-input-number v-model="Dconfig['bottom']"></el-input-number>
    <el-divider />
    字号(比例)：<el-input-number
      v-model="Dconfig['font_size']"
      :precision="1"
      :step="0.1"
    ></el-input-number>
    <el-divider />
    弹幕间距[弹幕间隔的最小水平距离(像素)]：
    <el-input-number
      v-model="Dconfig['space']"
      :precision="1"
      :step="0.1"
    ></el-input-number>
    <el-divider />
    滑动弹幕时长[右到左弹幕持续时间(秒)]：
    <el-input-number v-model="Dconfig['r2ltime']"></el-input-number>
    <el-divider />
    固定弹幕时长[固定弹幕持续时间(秒)]：
    <el-input-number v-model="Dconfig['fixtime']"></el-input-number>
    <el-divider />
    弹幕最大延迟[最多允许延迟几秒出现弹幕]：
    <el-input-number v-model="Dconfig['max_delay']"></el-input-number>
    <el-divider />
    不透明度(比例)：
    <el-slider
      v-model="Dconfig['opacity']"
      :max="1"
      :format-tooltip="(val: number) => { return val * 100 + '%' }"
      show-input
    />
    <el-divider />
    <el-input v-model="FN" placeholder="请输入文件名" clearable>
      <template #prepend>文件名：</template>
      <template #append>.{{ FE }}</template>
    </el-input>
    <el-divider />
    <el-button
      :type="B_xml2ass.type"
      :disabled="B_xml2ass.isDisabled"
      @click="Change(DanmakuFile, 'xml2ass')"
      >XML转换为ASS</el-button
    >
    <el-button
      :type="B_json2ass.type"
      :disabled="B_json2ass.isDisabled"
      @click="Change(DanmakuFile, 'json2ass')"
      >JSON(标准)转换为ASS</el-button
    >
  </div>
</template>
<style></style>
