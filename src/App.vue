<template>
  <div class="app">
    <img :src="backgroundImageUrl">
    <div class="absolute_temp_container">
      <div class="inner_items">
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
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: rgb(255, 255, 255);
  height: 90%;
  width: 90%;
  left: 5%;
  top: 5%;
  box-shadow: 'light';
  align-items: center;
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


.inner_items{
  display: flex;
  flex-wrap: wrap;
  position: relative;
  flex-direction: column;
  margin-top: 2.5%;
  height: 70%;
  align-items: center;
}

.absolute_temp_container{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  position: absolute;
  margin-top: 12.5%;
  height: 70%;
  align-items: center;
}


</style>
