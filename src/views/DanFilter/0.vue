<script setup lang="ts">
import { ref, reactive } from "vue";
import Steps from "@/views/DanFilter/Steps.vue";
import { ElNotification, genFileId } from "element-plus";
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  ButtonType,
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { Filter } from "@/utils/DanChange";
import { FTC, EXT, FNeEXT } from "@/utils/FileTypeCheck";
import { startDownload } from "@/utils/Download";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const zip = new JSZip();

interface B_ {
  type?: ButtonType;
  isDisabled: boolean;
}

interface DanmakuFile {
  name: string;
  ext: string;
  content: string;
}

const DanmakuRule = ref("");
const DanmakuFile = reactive<DanmakuFile[]>([]);
const NextButton = ref<B_>({ isDisabled: true });

const upload = ref<UploadInstance>();

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const openFile1 = (file: any) => {
  const reader = new FileReader();
  reader.onload = function () {
    if (!reader.result) return false;
    if (!FTC(file["name"], ["xml", "txt"])) return false;
    DanmakuRule.value = reader.result.toString(); //读取值
    NextButton.value.isDisabled = false;
  };
  reader.readAsText(file.raw);
};

const openFile2 = (file: any) => {
  const reader = new FileReader();
  reader.onload = function () {
    const DanmakuFile_bak = JSON.parse(JSON.stringify(DanmakuFile));
    if (!reader.result) return false;
    if (!FTC(file["name"], ["xml", "txt"])) return false;
    if (DanmakuFile.length > 0) {
      for (const x of DanmakuFile_bak) {
        if (x.name + "." + x.ext == file["name"]) {
          DanmakuFile.push({
            name: FNeEXT(file["name"]) + "(1)",
            ext: EXT(file["name"]),
            content: reader.result.toString(),
          });
        } else {
          DanmakuFile.push({
            name: FNeEXT(file["name"]),
            ext: EXT(file["name"]),
            content: reader.result.toString(),
          });
        }
      }
    } else {
      DanmakuFile.push({
        name: FNeEXT(file["name"]),
        ext: EXT(file["name"]),
        content: reader.result.toString(),
      }); //读取值
    }
    NextButton.value.isDisabled = false;
  };
  reader.readAsText(file.raw);
};

const RemoveAll2 = () => {
  DanmakuFile.splice(0, DanmakuFile.length);
};

function Change(File: object[], Action: string) {
  ElNotification({
    title: "提示",
    message: "转换需大约5s，大文件需更多时间。",
  });
  if (Action == "xmlFilter") {
    if (DanmakuFile.length > 1) {
      let ChangedDans: DanmakuFile[] = [];
      for (const dan of DanmakuFile) {
        ChangedDans.push({
          name: dan.name + "_m",
          ext: dan.ext,
          content: Filter.xml(Filter.xml2json(DanmakuRule.value), dan.content),
        });
      }
      for (const dan of ChangedDans) {
        zip.file(dan.name + "." + dan.ext, dan.content);
      }
      zip.generateAsync({ type: "blob" }).then(function (blob) {
        saveAs(blob, "danmaku.zip");
      });
    }
    if (DanmakuFile.length == 1) {
      startDownload(
        Filter.xml(Filter.xml2json(DanmakuRule.value), DanmakuFile[0].content),
        DanmakuFile[0].name + "_m." + DanmakuFile[0].ext
      );
    }
  }
}
</script>
<template>
  <Steps :step="Number($route.params.step || 0)" />
  <el-divider />
  <template v-if="Number($route.params.step || 0) == 0">
    <h2>上传弹幕屏蔽规则</h2>
    <p>
      您可以使用从别处得到的XML屏蔽规则文件。<br />
      例如：打开<el-link
        type="primary"
        target="_blank"
        href="https://harrynull.tech/bilibili/"
        >Bilibili 屏蔽词分享平台</el-link
      >，选择合适的规则并点击导出按钮，即可获取到规则文件。
    </p>
    <p>
      当您需要同时使用多份规则，请先选择任意一份规则进行过滤，并将过滤后的弹幕文件再次使用其他规则过滤。
    </p>
    <el-divider />
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      :auto-upload="false"
      :limit="1"
      :on-exceed="handleExceed"
      :on-change="openFile1"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖动文件至此 或 <em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-red">
          请选择弹幕过滤规则文件，如：.xml 。
        </div>
      </template>
    </el-upload>
    <el-button
      @click="
        NextButton.isDisabled = true;
        RemoveAll2;
        $router.push('/DanFilter/1');
      "
      :disabled="NextButton.isDisabled"
      style="float: right"
      >下一步</el-button
    >
  </template>
  <template v-if="Number($route.params.step || 0) == 1">
    <h2>上传弹幕文件</h2>
    <p>
      请确保所选文件为正确弹幕文件，否则可能转换失败。<br />
      由于为浏览器本地处理，上传大文件可能会造成卡顿甚至崩溃。<br />
      此处仅支持XML弹幕文件(B站)。
    </p>
    <p>注意，删除文件会清空整个列表，请看清楚文件在进行上传。</p>
    <el-divider />
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      :auto-upload="false"
      :on-change="openFile2"
      :on-remove="RemoveAll2"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖动文件至此 或 <em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-red">请选择弹幕文件，如：.xml 。</div>
      </template>
    </el-upload>
    <el-button
      @click="
        NextButton.isDisabled = true;
        $router.push('/DanFilter/2');
      "
      :disabled="NextButton.isDisabled"
      style="float: right"
      >下一步</el-button
    >
  </template>
  <template v-if="Number($route.params.step || 0) == 2">
    <h2>开始过滤</h2>
    <p>
      当需过滤文件数大于等于2时，自动打包为zip文件。<br />
      文件名会在原文件名后加上 _m 区分。
    </p>
    <p>待过滤弹幕数：{{ DanmakuFile.length }}</p>
    <el-button type="success" @click="Change(DanmakuFile, 'xmlFilter')"
      >XML弹幕过滤</el-button
    >
  </template>
</template>
<style></style>
