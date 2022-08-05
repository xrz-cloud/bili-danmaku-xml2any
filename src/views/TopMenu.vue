<script setup lang="ts">
import { ref } from "vue";

const activeIndex = ref("/");
</script>
<template>
  <el-menu :defult-active="activeIndex" mode="horizontal" router>
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/Dan2json">XML &lt;=> JSON</el-menu-item>
    <el-menu-item index="/Dan2ass">XML/JSON => ASS</el-menu-item>
    <el-menu-item index="/about">关于</el-menu-item>
  </el-menu>
</template>
<style></style>
