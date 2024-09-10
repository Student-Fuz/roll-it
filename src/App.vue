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

// 定义树节点类型
export interface TreeNode {
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default defineComponent({
  name: 'App',
  components: {
    BinaryTreeNode
  },
  setup() {
    // 背景图片
    const backgroundImageUrl = ref<string>('background.png');

    // 默认树的高度
    const defaultHeight = 3;
    const treeHeight = ref<number>(defaultHeight);

    // 根节点
    const rootNode = ref<TreeNode | null>(generateBinaryTree(treeHeight.value));

    // 生成树的函数
    function generateBinaryTree(h: number, level: number = 0): TreeNode | null {
      if (level > h) return null;
      return {
        value: `Node at level ${level}`,
        left: generateBinaryTree(h, level + 1),
        right: generateBinaryTree(h, level + 1),
      };
    }

    // 更新树的函数
    function updateTree() {
      rootNode.value = generateBinaryTree(treeHeight.value);
    }

    // 监听树的高度变化
    watch(treeHeight, updateTree);

    return {
      backgroundImageUrl,
      treeHeight,
      rootNode,
      updateTree  // Make sure updateTree is returned
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
