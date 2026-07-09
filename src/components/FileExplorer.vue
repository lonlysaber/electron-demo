<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { FileItem } from "../types";
import { useFileSystem } from "../composables/useFileSystem";

const props = defineProps<{
  initialPath?: string;
}>();

const emit = defineEmits<{
  (e: "openFile", item: FileItem): void;
  (e: "openDirectory", item: FileItem): void;
}>();

const { readDirectory } = useFileSystem();

const currentPath = ref("");
const items = ref<FileItem[]>([]);

const loadDirectory = async (path: string) => {
  currentPath.value = path;
  items.value = await readDirectory(path);
};

const handleItemClick = (item: FileItem) => {
  if (item.type === "directory") {
    loadDirectory(item.path);
  } else {
    emit("openFile", item);
  }
};

const handleItemDoubleClick = (item: FileItem) => {
  if (item.type === "directory") {
    emit("openDirectory", item);
  } else {
    emit("openFile", item);
  }
};

const getPathParts = () => {
  const parts = currentPath.value.split(/[\\/]/).filter((p) => p);
  let accumulatedPath = currentPath.value.startsWith("/") ? "/" : "";
  return parts.map((part, index) => {
    if (currentPath.value.startsWith("/")) {
      accumulatedPath += part + "/";
    } else {
      accumulatedPath += (index === 0 ? "" : "/") + part;
    }
    return { name: part, path: accumulatedPath };
  });
};

const goToPath = (path: string) => {
  loadDirectory(path);
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  if (props.initialPath) {
    loadDirectory(props.initialPath);
  }
});

watch(
  () => props.initialPath,
  (newPath) => {
    if (newPath) {
      loadDirectory(newPath);
    }
  }
);
</script>

<template>
  <div class="file-explorer">
    <div class="path-bar">
      <div
        v-for="(part, index) in getPathParts()"
        :key="index"
        class="path-part"
        @click="goToPath(part.path)"
      >
        <span>{{ part.name }}</span>
        <span v-if="index < getPathParts().length - 1" class="separator"
          >/</span
        >
      </div>
    </div>
    <div class="file-list">
      <div
        v-for="item in items"
        :key="item.path"
        class="list-item"
        @click="handleItemClick(item)"
        @dblclick="handleItemDoubleClick(item)"
      >
        <div class="item-icon">
          <svg
            v-if="item.type === 'directory'"
            t="1783599238304"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1899"
            width="32"
            height="32"
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
            width="32"
            height="32"
          >
            <path
              d="M417.798203 1016.25308c28.670112 16.894887 51.196629 5.631629 51.196629-28.670112V588.76123c0-34.301741-23.038483-68.603482-51.196629-85.49837L87.579948 297.964379c-28.670112-11.263258-51.196629 0-51.196629 28.670112v398.821738c0 34.301741 23.038483 68.603482 51.196629 85.49837l330.218255 205.298481zM138.776577 172.532639c-28.670112 16.894887-28.670112 39.93337 0 56.828258l325.098592 205.298481c28.670112 16.894887 68.603482 16.894887 96.761628 5.631629L885.73539 274.925896c28.670112-16.894887 28.670112-39.93337 0-56.828258L543.229944 12.799157c-23.038483-16.894887-68.603482-16.894887-96.761629 0L138.776577 172.532639z m421.86022 815.050329c0 34.301741 23.038483 45.565 51.196629 28.670112l325.098592-165.365111c28.670112-16.894887 51.196629-51.196629 51.196629-85.49837v-399.333704c0-34.301741-23.038483-45.565-51.196629-28.670112l-325.098592 165.365111c-28.670112 16.894887-51.196629 51.196629-51.196629 85.49837v399.333704z"
              fill="#1296db"
              p-id="2945"
            ></path>
          </svg>
        </div>
        <div class="item-info">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-details">
            <span class="size">{{
              item.type === "directory" ? "文件夹" : formatSize(item.size)
            }}</span>
            <span class="date">{{ formatDate(item.mtime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-explorer {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.9);
}

.path-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 4px;
}

.path-part {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.path-part:hover {
  background: rgba(255, 255, 255, 0.1);
}

.path-part span {
  font-size: 12px;
}

.separator {
  margin-left: 4px;
  color: rgba(255, 255, 255, 0.5);
}

.file-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.item-icon {
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-details {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.size,
.date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
