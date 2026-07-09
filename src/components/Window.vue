<script setup lang="ts">
import { ref } from 'vue';
import type { WindowState } from '../types';

const props = defineProps<{
  window: WindowState;
}>();

const emit = defineEmits<{
  (e: 'close', id: number): void;
  (e: 'minimize', id: number): void;
  (e: 'maximize', id: number): void;
  (e: 'move', id: number, x: number, y: number): void;
  (e: 'focus', id: number): void;
}>();

const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const windowStartX = ref(0);
const windowStartY = ref(0);

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true;
  dragStartX.value = e.clientX;
  dragStartY.value = e.clientY;
  windowStartX.value = props.window.x;
  windowStartY.value = props.window.y;
  emit('focus', props.window.id);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const deltaX = e.clientX - dragStartX.value;
  const deltaY = e.clientY - dragStartY.value;
  emit('move', props.window.id, windowStartX.value + deltaX, windowStartY.value + deltaY);
};

const handleMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

const handleClose = () => {
  emit('close', props.window.id);
};

const handleMinimize = () => {
  emit('minimize', props.window.id);
};

const handleMaximize = () => {
  emit('maximize', props.window.id);
};
</script>

<template>
  <div
    class="window"
    :class="{
      'is-minimized': window.isMinimized,
      'is-maximized': window.isMaximized,
    }"
    :style="{
      left: window.x + 'px',
      top: window.y + 'px',
      width: window.isMaximized ? '100%' : window.width + 'px',
      height: window.isMaximized ? '100%' : window.height + 'px',
      zIndex: window.zIndex,
    }"
    @mousedown="emit('focus', window.id)"
  >
    <div class="window-header" @mousedown="handleMouseDown">
      <div class="window-title">{{ window.title }}</div>
      <div class="window-controls">
        <button class="control-btn minimize" @click.stop="handleMinimize">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <rect x="2" y="5" width="8" height="2" fill="currentColor" />
          </svg>
        </button>
        <button class="control-btn maximize" @click.stop="handleMaximize">
          <svg v-if="!window.isMaximized" viewBox="0 0 12 12" width="12" height="12">
            <rect x="2" y="2" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
          <svg v-else viewBox="0 0 12 12" width="12" height="12">
            <rect x="2" y="3" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1" />
            <rect x="5" y="2" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
        </button>
        <button class="control-btn close" @click.stop="handleClose">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1" />
          </svg>
        </button>
      </div>
    </div>
    <div class="window-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  background: rgba(30, 30, 46, 0.95);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.window-header {
  height: 36px;
  background: rgba(40, 40, 60, 0.9);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: grab;
  user-select: none;
}

.window-header:active {
  cursor: grabbing;
}

.window-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.control-btn.minimize {
  background: #fbbf24;
  color: #fbbf24;
}

.control-btn.maximize {
  background: #4ade80;
  color: #4ade80;
}

.control-btn.close {
  background: #f87171;
  color: #f87171;
}

.control-btn:hover {
  opacity: 0.8;
}

.window-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.window.is-minimized {
  display: none;
}

.window.is-maximized {
  left: 0 !important;
  top: 0 !important;
  border-radius: 0;
}
</style>
