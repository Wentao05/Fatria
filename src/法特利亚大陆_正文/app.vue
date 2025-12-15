<template>
  <div class="react-app-shell">
    <div ref="reactContainer" class="w-full min-h-full" />
  </div>
</template>

<script setup lang="ts">
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import ReactApp from './chronicles-of-aethelgard---rpg-ui/App';
import './index.scss';

const reactContainer = ref<HTMLDivElement | null>(null);
let root: Root | null = null;

const mountReactApp = () => {
  if (!reactContainer.value) {
    console.error('React 容器未找到，无法挂载界面');
    return;
  }
  root = createRoot(reactContainer.value);
  root.render(React.createElement(React.StrictMode, null, React.createElement(ReactApp)));
};

onMounted(mountReactApp);
onBeforeUnmount(() => {
  root?.unmount();
  root = null;
});
</script>

<style scoped>
.react-app-shell {
  width: 100%;
  height: 100%;
}
</style>
