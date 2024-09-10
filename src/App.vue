<template>
  <div id="app">
    <div  :style="{ backgroundImage: `url(${backgroundImageUrl})` }" class="background-image">
      <h1>赛博空间250实验室第XX届糖人杯---英雄联盟赛道</h1>
      <div class="controls">
        <label for="height">选择比赛轮次：</label>
        <input
          id="height"
          type="number"
          min="1"
          v-model.number="treeHeight"
          @change="updateTree"
        />
      </div>
      <BinaryTreeNode :node="rootNode" />
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import BinaryTreeNode from './BinaryTreeNode.vue';
import type { TreeNode } from './types/TreeNode'; // 使用 type 导入

export default defineComponent({
  name: 'App',
  components: {
    BinaryTreeNode
  },
  setup() {
    const backgroundImageUrl = ref<string>('background.png');
    const defaultHeight = 3;
    const treeHeight = ref<number>(defaultHeight);
    const rootNode = ref<TreeNode | null>(generateBinaryTree(treeHeight.value));

    function generateBinaryTree(h: number, level: number = 0): TreeNode | null {
      if (level > h) return null;
      return {
        value: `Node at level ${level}`,
        left: generateBinaryTree(h, level + 1),
        right: generateBinaryTree(h, level + 1),
      };
    }

    function updateTree() {
      rootNode.value = generateBinaryTree(treeHeight.value);
    }

    watch(treeHeight, updateTree);

    return {
      backgroundImageUrl,
      treeHeight,
      rootNode,
      updateTree
    };
  }
});


</script>

<style scoped>
.app {
  text-align: center;
}

.controls {
  margin-bottom: 20px;
}

input {
  width: 60px;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}
</style>
