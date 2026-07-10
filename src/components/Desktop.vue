<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { FileItem, WindowState } from "../types";
import { useFileSystem } from "../composables/useFileSystem";
import DesktopIcon from "./DesktopIcon.vue";
import Window from "./Window.vue";
import FileExplorer from "./FileExplorer.vue";

const { readDirectory, getDesktopPath, getHomePath, getPlatform, openFile } =
  useFileSystem();

const desktopItems = ref<FileItem[]>([]);
const windows = ref<WindowState[]>([]);
const platform = ref("");
let nextWindowId = 1;
let nextZIndex = 100;

const openWindow = (title: string, initialPath?: string) => {
  const window: WindowState = {
    id: nextWindowId++,
    title,
    initialPath,
    x: 50 + windows.value.length * 30,
    y: 50 + windows.value.length * 30,
    width: 800,
    height: 500,
    isMinimized: false,
    isMaximized: false,
    zIndex: nextZIndex++,
  };
  windows.value.push(window);
};

const closeWindow = (id: number) => {
  windows.value = windows.value.filter((w) => w.id !== id);
};

const minimizeWindow = (id: number) => {
  const window = windows.value.find((w) => w.id === id);
  if (window) {
    window.isMinimized = true;
  }
};

const maximizeWindow = (id: number) => {
  const window = windows.value.find((w) => w.id === id);
  if (window) {
    if (!window.isMaximized) {
      window.prevX = window.x;
      window.prevY = window.y;
      window.prevWidth = window.width;
      window.prevHeight = window.height;
      window.x = 0;
      window.y = 0;
      window.width = window.innerWidth;
      window.height = window.innerHeight;
      window.isMaximized = true;
    } else {
      if (window.prevX !== undefined) window.x = window.prevX;
      if (window.prevY !== undefined) window.y = window.prevY;
      if (window.prevWidth !== undefined) window.width = window.prevWidth;
      if (window.prevHeight !== undefined) window.height = window.prevHeight;
      window.isMaximized = false;
    }
  }
};

const moveWindow = (id: number, x: number, y: number) => {
  const window = windows.value.find((w) => w.id === id);
  if (window) {
    window.x = Math.max(0, x);
    window.y = Math.max(0, y);
  }
};

const focusWindow = (id: number) => {
  const window = windows.value.find((w) => w.id === id);
  if (window) {
    window.zIndex = nextZIndex++;
  }
};

const handleIconClick = (item: FileItem) => {
  console.log("item", item);
  if (item.type === "directory") {
    openWindow(item.name, item.path);
  } else {
    openFile(item.path);
  }
};

const handleOpenFile = (item: FileItem) => {
  openFile(item.path);
};

const openFileExplorer = async () => {
  let initialPath: string;
  if (platform.value === "darwin") {
    initialPath = await getHomePath();
  } else {
    initialPath = await getDesktopPath();
  }
  openWindow('文件资源管理器', initialPath);
};

onMounted(async () => {
  platform.value = await getPlatform();
  const desktopPath = await getDesktopPath();
  desktopItems.value = await readDirectory(desktopPath);
});
</script>

<template>
  <div class="desktop" :class="platform">
    <div class="desktop-icons">
      <DesktopIcon
        v-for="item in desktopItems"
        :key="item.path"
        :item="item"
        @click="handleIconClick"
      />
    </div>
    <Window
      v-for="window in windows"
      :key="window.id"
      :window="window"
      @close="closeWindow"
      @minimize="minimizeWindow"
      @maximize="maximizeWindow"
      @move="moveWindow"
      @focus="focusWindow"
    >
      <FileExplorer
        :initial-path="window.initialPath"
        @open-file="handleOpenFile"
        @open-directory="openWindow($event.name, $event.path)"
      />
    </Window>
    <div class="dock">
      <button class="dock-item" @click="openFileExplorer()">
        <svg viewBox="0 0 48 48" width="48" height="48">
          <path
            d="M40 12H24l-4-4H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4z"
            fill="#4caf50"
          />
          <path d="M40 16H12v-4l4-4h24v8z" fill="rgba(255,255,255,0.3)" />
        </svg>
      </button>
      <button class="dock-item">
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="20" fill="#607d8b" />
          <path
            d="M24 8v16M24 32v8M8 24h16M32 24h8"
            stroke="rgba(255,255,255,0.8)"
            stroke-width="3"
            fill="none"
          />
          <circle cx="24" cy="24" r="6" fill="#90a4ae" />
        </svg>
      </button>
      <button class="dock-item">
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="20" fill="#e91e63" />
          <path
            d="M24 12v24M12 24h24"
            stroke="rgba(255,255,255,0.8)"
            stroke-width="3"
            fill="none"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.desktop {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;
  position: relative;
}

.desktop-icons {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 10px;
  width: 70%;
}

.dock {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dock-item {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-8px) scale(1.1);
}

.dock-item:active {
  transform: translateY(-4px) scale(1.05);
}

.desktop.win32 .desktop-icons {
  width: 100%;
}

.desktop.win32 .dock {
  display: none;
}
</style>
