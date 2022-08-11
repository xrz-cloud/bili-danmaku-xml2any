<script setup lang="ts">
import { ref } from "vue";
defineProps<{
  step: Number;
}>();
</script>
<template>
  <el-steps :active="step" finish-status="success">
    <el-step title="过滤规则" description="请上传弹幕屏蔽规则文件" />
    <el-step title="弹幕文件" description="请上传弹幕文件" />
    <el-step title="过滤完成" description="选择生成细节" />
  </el-steps>
</template>
<style></style>
