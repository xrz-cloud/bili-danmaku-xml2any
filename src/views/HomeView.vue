<script setup lang="ts"></script>

<template>
  <div class="greetings">
    <h1 class="green">欢迎访问</h1>
    <h3>这是一个可以将B站弹幕进行转换、过滤的小工具，不需要下载APP！</h3>
    <p>
      支持弹幕格式：XML(B站原生)、ASS、JSON(支持<el-link
        type="primary"
        target="_blank"
        href="//dplayer.js.org"
        >DPlayer</el-link
      >)...<br />
      点击顶栏选项来选择工具。
    </p>
    <h3>使用须知</h3>
    <p>
      请自行确认弹幕格式，并按照要求进行操作。<br />
      除API调用外，转换完全在本地进行，加载网页后无需联网上传后台。
    </p>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3,
.greetings p {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3,
  .greetings p {
    text-align: left;
  }
}
</style>
