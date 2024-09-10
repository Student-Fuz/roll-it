<template>
  <div class="node">
    <div class="node-content" v-if="node">
      <div class="box">
        <input
          v-if="isEditing"
          v-model="node.value"
          @blur="endEditing"
          autofocus
        />
        <span v-else @click="startEditing">
          <template v-if="isImage">
            <img :src="node.value" alt="Node Image" class="node-image" />
          </template>
          <template v-else>
            {{ node.value }}
          </template>
        </span>
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

interface TreeNode {
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;
}

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

    const lineWidth = 200;  // Adjust based on your layout
    const lineHeight = 40;  // Adjust based on your layout

    const linePath = computed(() => {
      if (!props.node) return ''; // Return empty path if node is null

      const nodeWidth = 100; // Width of the node box
      const nodeHeight = 40; // Height of the node box
      let path = `M ${lineWidth / 2} 0`; // Start from the top center of the parent node

      if (props.node.left || props.node.right) {
        path += ` L ${lineWidth / 2} ${lineHeight / 2}`; // Down to the middle
        if (props.node.left) {
          path += ` L ${lineWidth / 4} ${lineHeight / 2}`; // Connect to the middle of left child
        }
        if (props.node.right) {
          path += ` L ${3 * lineWidth / 4} ${lineHeight / 2}`; // Connect to the middle of right child
        }
      }

      return path;
    });

    const isImage = computed(() => {
      if (!props.node) return false; // Return false if node is null
      const urlPattern = /\.(jpg|jpeg|png|gif)$/i;
      return urlPattern.test(props.node.value);
    });

    function startEditing() {
      isEditing.value = true;
    }

    function endEditing() {
      isEditing.value = false;
    }

    return {
      isEditing,
      linePath,
      isImage,
      startEditing,
      endEditing,
      lineWidth,
      lineHeight
    };
  }
});
</script>

<style scoped>
.node {
  display: flex;
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
  border: 2px solid black;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  display: flex;
  align-items: center;
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
</style>
