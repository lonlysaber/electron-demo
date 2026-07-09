<script setup lang="ts">
import { computed } from "vue";
import type { FileItem } from "../types";

const props = defineProps<{
  item: FileItem;
}>();

const emit = defineEmits<{
  (e: "click", item: FileItem): void;
}>();

</script>

<template>
  <div class="desktop-icon" @click="emit('click', item)">
    <div class="icon-wrapper">
      <svg
        v-if="item.type === 'directory'"
        t="1783599238304"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1899"
        width="200"
        height="200"
      >
        <path
          d="M912 208H427.872l-50.368-94.176A63.936 63.936 0 0 0 321.056 80H112c-35.296 0-64 28.704-64 64v736c0 35.296 28.704 64 64 64h800c35.296 0 64-28.704 64-64v-608c0-35.296-28.704-64-64-64z m-800-64h209.056l68.448 128H912v97.984c-0.416 0-0.8-0.128-1.216-0.128H113.248c-0.416 0-0.8 0.128-1.248 0.128V144z m0 736v-96l1.248-350.144 798.752 1.216V784h0.064v96H112z"
          fill="#f4ea2a"
          p-id="1900"
        ></path>
      </svg>
      <svg
        v-else
        t="1783599361608"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2944"
        width="200"
        height="200"
      >
        <path
          d="M417.798203 1016.25308c28.670112 16.894887 51.196629 5.631629 51.196629-28.670112V588.76123c0-34.301741-23.038483-68.603482-51.196629-85.49837L87.579948 297.964379c-28.670112-11.263258-51.196629 0-51.196629 28.670112v398.821738c0 34.301741 23.038483 68.603482 51.196629 85.49837l330.218255 205.298481zM138.776577 172.532639c-28.670112 16.894887-28.670112 39.93337 0 56.828258l325.098592 205.298481c28.670112 16.894887 68.603482 16.894887 96.761628 5.631629L885.73539 274.925896c28.670112-16.894887 28.670112-39.93337 0-56.828258L543.229944 12.799157c-23.038483-16.894887-68.603482-16.894887-96.761629 0L138.776577 172.532639z m421.86022 815.050329c0 34.301741 23.038483 45.565 51.196629 28.670112l325.098592-165.365111c28.670112-16.894887 51.196629-51.196629 51.196629-85.49837v-399.333704c0-34.301741-23.038483-45.565-51.196629-28.670112l-325.098592 165.365111c-28.670112 16.894887-51.196629 51.196629-51.196629 85.49837v399.333704z"
          fill="#1296db"
          p-id="2945"
        ></path>
      </svg>
    </div>
    <div class="icon-label">{{ item.name }}</div>
  </div>
</template>

<style scoped>
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 100px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.desktop-icon:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.desktop-icon:active {
  transform: scale(0.98);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.icon {
  transition: filter 0.2s ease;
}

.folder-icon {
  color: #ffc107;
}

.file-icon {
  color: #64b5f6;
}

.icon-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  word-break: break-all;
  line-height: 1.3;
  max-height: 32px;
  overflow: hidden;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
</style>
