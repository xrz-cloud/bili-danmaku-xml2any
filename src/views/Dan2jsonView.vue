<script setup lang="ts">
import { ref } from "vue";
import { ElNotification, genFileId } from "element-plus";
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  ButtonType,
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { xml2json, json2xml } from "@/utils/DanChange";
import { FTC, EXT, EXT2FT_zh, FNeEXT } from "@/utils/FileTypeCheck";
import { startDownload } from "@/utils/Download";

const DanmakuType = ref<string | undefined>("无");
interface B_ {
  type: ButtonType;
  isDisabled: boolean;
}
const B_default: B_ = { type: "", isDisabled: true };
const B_xml2json = ref<B_>(B_default);
const B_xml2jsonDPlayer = ref<B_>(B_default);
const B_xml2jsonArtPlayer = ref<B_>(B_default);
const B_json2xml = ref<B_>(B_default);

const DanmakuFile = ref("");
const FN = ref(""); //文件名(去扩展名)
const FE = ref(""); //生成的文件的扩展名

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
  B_xml2json.value = B_default;
  B_xml2jsonDPlayer.value = B_default;
  B_xml2jsonArtPlayer.value = B_default;
  B_json2xml.value = B_default;
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
      FE.value = "json";
      B_xml2json.value = B_abled;
      B_xml2jsonDPlayer.value = B_abled;
      B_xml2jsonArtPlayer.value = B_abled;
    } else if (ext == "json") {
      FE.value = "xml";
      B_json2xml.value = B_abled;
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
  if (Action == "xml2json") {
    startDownload(
      xml2json.main(File),
      filename.replace(/\.[^.]*$/, "") + ".json"
    );
    return false;
  }
  if (Action == "xml2jsonDPlayer") {
    startDownload(
      xml2json.DPlayer(xml2json.main(File)),
      filename.replace(/\.[^.]*$/, "") + ".json"
    );
    return false;
  }
  if (Action == "xml2jsonArtPlayer") {
    startDownload(
      xml2json.ArtPlayer(xml2json.main(File)),
      filename.replace(/\.[^.]*$/, "") + ".json"
    );
    return false;
  }
  if (Action == "json2xml") {
    startDownload(
      json2xml.main(File),
      filename.replace(/\.[^.]*$/, "") + ".xml"
    );
    return false;
  }
}
</script>
<template>
  <h2>0. 使用须知</h2>
  <p>
    请确保所选文件为正确弹幕文件，否则可能转换失败。<br />
    由于为浏览器本地处理，上传大文件可能会造成卡顿甚至崩溃。
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
    <h2>2. 选择转换模式</h2>
    弹幕类型：{{ DanmakuType }}
    <el-divider />
    <el-input v-model="FN" placeholder="请输入文件名" clearable>
      <template #prepend>文件名：</template>
      <template #append>.{{ FE }}</template>
    </el-input>
    <el-divider />
    <el-button
      :type="B_xml2json.type"
      :disabled="B_xml2json.isDisabled"
      @click="Change(DanmakuFile, 'xml2json')"
      >XML转换为JSON(标准)</el-button
    >
    <el-button
      :type="B_xml2jsonDPlayer.type"
      :disabled="B_xml2jsonDPlayer.isDisabled"
      @click="Change(DanmakuFile, 'xml2jsonDPlayer')"
      >XML转换为JSON(DPlayer)</el-button
    >
    <el-button
      :type="B_xml2jsonDPlayer.type"
      :disabled="B_xml2jsonDPlayer.isDisabled"
      @click="Change(DanmakuFile, 'xml2jsonArtPlayer')"
      >XML转换为JSON(ArtPlayer)</el-button
    >
    <el-button
      :type="B_json2xml.type"
      :disabled="B_json2xml.isDisabled"
      @click="Change(DanmakuFile, 'json2xml')"
      >JSON(标准)转换为XML</el-button
    >
  </div>
</template>
<style></style>
