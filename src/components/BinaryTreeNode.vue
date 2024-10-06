<template>
  <div class="node">
    <div class="node-content" v-if="node">
      <div class="box" @click="handleLeftClick" @contextmenu="handleRightClick" :style="{ width: `${nodeWidth}px`, height: `${nodeHeight}px` }">
        <img :src="node.avatarUrl" alt="Avatar" class="avatar">
        <span class="nickname">{{ node.nickname }}</span>
      </div>
      <svg
        class="line"
        v-if="node.left || node.right"
        :width="lineWidth"
        :height="lineHeight"
      >
        <path :d="linePath" stroke="black" stroke-width="2" fill="none" />
      </svg>
    </div>
    <div class="children">
      <div v-if="node?.left" class="child">
        <BinaryTreeNode :node="node.left" />
      </div>
      <div v-if="node?.right" class="child">
        <BinaryTreeNode :node="node.right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import type { PropType } from 'vue';
import type { TreeNode } from '../types/TreeNode'; // 使用 type 导入

const undeterminedPlayerUrl = ref<string>('avatars/undetermined.png');

export default defineComponent({
  name: 'BinaryTreeNode',
  props: {
    node: {
      type: Object as PropType<TreeNode | null>, // Allow null
      required: true
    }
  },
  setup(props) {
    const isEditing = ref<boolean>(false);

    const nodeWidth = 60; // 通过这个值控制 box 的宽度
    const nodeHeight = 90; // Height of the node box

    const lineWidth = 1080;  // Adjust based on your layout
    const lineHeight = 40;  // Adjust based on your layout

    const linePath = computed(() => {
      if (!props.node) return ''; // Return empty path if node is null


      let path = `M ${lineWidth / 2} 0`; // Start from the top center of the parent node

      if (props.node.left || props.node.right) {
        path += ` L ${lineWidth / 2} ${lineHeight / 4}`; // Down to the middle
        if (props.node.left) {
          // Connect to the middle of left child
          path += ` L ${lineWidth / 2 - (2**(props.node.heightReverse-1))*(nodeWidth/2 + 20)} ${lineHeight / 4}`;
          path += ` L ${lineWidth / 2 - (2**(props.node.heightReverse-1))*(nodeWidth/2 + 20)} ${lineHeight / 2}`;
        }
        if (props.node.right) {
          // Connect to the middle of right child
          path += `M ${lineWidth / 2} ${lineHeight / 4}`;
          path += ` L ${lineWidth / 2 + (2**(props.node.heightReverse-1))*(nodeWidth/2 + 20)} ${lineHeight / 4}`;
          path += ` L ${lineWidth / 2 + (2**(props.node.heightReverse-1))*(nodeWidth/2 + 20)} ${lineHeight / 2}`;
        }
      }

      return path;
    });

    // Define the event handler functions
    const handleLeftClick = (event: MouseEvent) => {
      if (event.button === 0 && props.node && props.node.father) {
        // 晋级操作
        props.node.father.avatarUrl = props.node.avatarUrl;
        props.node.father.nickname = props.node.nickname;
      }
    };

    const handleRightClick = (event: MouseEvent) => {
      if (event.button === 2) {
        event.preventDefault(); // Prevent the default context menu from showing
        // 取消
        if (props.node) {
          props.node.avatarUrl = undeterminedPlayerUrl.value;
          props.node.nickname = "待定";
        }
      }
    };

    return {
      isEditing,
      nodeWidth,
      nodeHeight,
      linePath,
      lineWidth,
      lineHeight,
      handleLeftClick,
      handleRightClick
    };
  }
});
</script>

<style scoped>
.node {
  display: block;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: center; /* Vertically center items */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

input {
  border: none;
  background-color: white;
  text-align: center;
  width: 100%;
}

input:focus {
  outline: none;
}

.node-image {
  max-width: 100px; /* Adjust as needed */
  max-height: 100px; /* Adjust as needed */
}

.line {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.children {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.child {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 50px; /* Set the width of the avatar */
  height: 50px; /* Set the height of the avatar */
  border-radius: 50%; /* Make the avatar circular */
}

.nickname {
  font-size: 1.0em; /* Set the font size for the nickname */
  color: #333; /* Set the text color */
  align-items: center;
}
</style>
