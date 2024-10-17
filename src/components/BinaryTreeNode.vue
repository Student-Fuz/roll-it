<template>
  <div class="node">
    <div class="node-content" v-if="node">
      <div class="box"  @click="handleLeftClick" 
                        @contextmenu="handleRightClick"  
                        @mousedown="startPress"
                        @mouseup="endPress"
                        @mouseleave="endPress" 
                        :style="{ width: `${nodeWidth}px`, height: `${nodeHeight}px` }">
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
      <div v-if="node?.left" class="child" :style="{ marginTop: lineHeight + 'px' }">
        <BinaryTreeNode :node="node.left" />
      </div>
      <div v-if="node?.right" class="child" :style="{ marginTop: lineHeight + 'px' }">
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

    const lineHeight = 40;  // Adjust based on your layout

    const longPressTimeout = ref<number | null>(null);
    const isLongPressing = ref(false);

    const lineWidth = computed(() => {
      if (!props.node) return 0; // Return empty path if node is null
      let width = 0;
      width = 2**(props.node.heightReverse)*(nodeWidth+20);
      return width;
    });

    const linePath = computed(() => {
      if (!props.node) return ''; // Return empty path if node is null


      let path = `M ${lineWidth.value / 2} 0`; // Start from the top center of the parent node

      if (props.node.left || props.node.right) {
        path += ` L ${lineWidth.value / 2} ${lineHeight / 2}`; // Down to the middle
        if (props.node.left) {
          // Connect to the middle of left child
          path += ` L ${lineWidth.value / 2 - (2**(props.node.heightReverse-1))*(nodeWidth/2 + 20)} ${lineHeight / 2}`;
          path += ` L ${lineWidth.value / 2 - (2**(props.node.heightReverse-1))*(nodeWidth/2 + 20)} ${lineHeight}`;
        }
        if (props.node.right) {
          // Connect to the middle of right child
          path += `M ${lineWidth.value / 2} ${lineHeight / 2}`;
          path += ` L ${lineWidth.value / 2 + (2**(props.node.heightReverse-1))*(nodeWidth/2 + 20)} ${lineHeight / 2}`;
          path += ` L ${lineWidth.value / 2 + (2**(props.node.heightReverse-1))*(nodeWidth/2 + 20)} ${lineHeight}`;
        }
      }

      return path;
    });

    // 开始长按
    const startPress = () => {
      longPressTimeout.value = setTimeout(() => {
        isLongPressing.value = true;
        handleLongPress();
      }, 500); // 500ms后触发长按事件
    };

    // 结束长按
    const endPress = () => {
      if (longPressTimeout.value !== null) {
        clearTimeout(longPressTimeout.value);
        longPressTimeout.value = null; // 重置为 null
      }
      if (isLongPressing.value) {
        isLongPressing.value = false; // 重置状态
      }
    };

    // 处理长按事件的函数
    const handleLongPress = () => {
      // 取消
      if (props.node) {
        props.node.avatarUrl = undeterminedPlayerUrl.value;
        props.node.nickname = "待定";
      }
    };

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
      handleRightClick,
      startPress,
      endPress
    };
  }
});
</script>

<style scoped>

.node {
  display:flex;
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
  /* position: relative; */
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.children {
  display: flex;
  gap: 20px;
  position: relative;
}

.child {
  display: flex;
  flex: 1; 
  flex-direction: row;
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
