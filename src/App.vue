<template>
  <div class="app">
    <img :src="backgroundImageUrl">
    <div class="absolute_temp_container">
      <!-- **********************定义组件开始*********************** -->
      <div class="inner_items">
        <h1>赛博空间250实验室第XX届糖人杯---英雄联盟赛道</h1>
        <div class="controls">
          <label for="height">选择比赛轮次：</label>
          <input
            id="height"
            type="number"
            min="1"
            max="4"

            v-model.number="treeHeight"
            @change="updateTree"
          />
        </div>
        <BinaryTreeNode :node="rootNode" />
        <!-- 添加按钮，点击时调用 changeLeafNodes 函数 -->
        <button @click="handleClick">一键抽签</button>
      </div>

      <h2>比赛选手展示</h2>
      <div class="players-grid">
        <PlayerCard
          v-for="player in players"
          :key="player.id"
          :nickname="player.nickname"
          :avatarUrl="player.avatarUrl"
          :slogan="player.slogan"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import BinaryTreeNode from './BinaryTreeNode.vue';
import type { TreeNode } from './types/TreeNode'; 
import type { Player } from './types/Player'; 
import PlayerCard from './components/PlayerCard.vue';

export default defineComponent({
  name: 'App',
  components: {
    BinaryTreeNode, 
    PlayerCard
  },
  setup() {
    const backgroundImageUrl = ref<string>('background.png');
    const playersListUrl = ref<string>('players.json');
    const defaultPlayerUrl = ref<string>('avatars/default.png');
    const undeterminedPlayerUrl = ref<string>('avatars/undetermined.png');
    const defaultHeight = 3;
    const treeHeight = ref<number>(defaultHeight);
    const rootNode = ref<TreeNode | null>(generateBinaryTree(treeHeight.value, 0, null));
    const players = ref<Player[]>([]);  
    const PlayersMap = ref<Map<number, Player>>(new Map()); 
    const loading = ref(true);

    // 抽签相关
    // 使用 Array.from 方法生成索引数组
    let indexArray = ref(Array.from({ length: 2**treeHeight.value }, (_, index) => index));

    // 使用 fetch 加载 JSON 文件
    const fetchPlayers = async () => {
      try {
        const response = await fetch(playersListUrl.value);
        if (!response.ok) {
          throw new Error('Failed to fetch players data');
        }
        players.value = await response.json();
      } catch (error) {
        console.error('Error loading players:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchPlayers();
    });

    function generateBinaryTree(h: number, level: number = 0, fatherNode: TreeNode | null = rootNode.value): TreeNode | null {
      if (level > h) return null;
      const currNode: TreeNode = {
        avatarUrl: undeterminedPlayerUrl.value,
        nickname: "待定",
        father: fatherNode,
        left: null,
        right: null,
      };
      currNode.left = generateBinaryTree(h, level + 1, currNode);
      currNode.right = generateBinaryTree(h, level + 1, currNode);
      return currNode;
      // return {
      //   avatarUrl: `background.png`,
      //   nickname: `player at level ${level}`,
      //   left: generateBinaryTree(h, level + 1),
      //   right: generateBinaryTree(h, level + 1, ),
      // };
    }

    // 递归地生成完全二叉树
    function updateTree() {
      rootNode.value = generateBinaryTree(treeHeight.value);
    }

    // 一键抽签
    function handleClick(event: MouseEvent) {
      // 处理 MouseEvent 事件
      changeLeafNodes();
      indexArray = ref(Array.from({ length: 2**treeHeight.value }, (_, index) => index));
    }
    // 遍历二叉树并修改叶子节点
    function changeLeafNodes(node: TreeNode | null = rootNode.value) {
      if (!node) return;
      if (!node.left && !node.right) {
        // 这是一个叶子节点
        let rand = getRandomInt(0, indexArray.value.length-1)
        let item = getPlayerById(indexArray.value[rand]+1);
        indexArray.value.splice(rand,1);
        node.avatarUrl = item?.avatarUrl as string;
        node.nickname = item?.nickname as string;
      } else {
        // 递归遍历左右子树
        if (node.left) changeLeafNodes(node.left);
        if (node.right) changeLeafNodes(node.right);
      }
    }

    // 更新 PlayersMap 的函数
    function updatePlayersMap() {
      PlayersMap.value = new Map(players.value.map(item => [item.id, item]));
    }

    function getPlayerById(id: number) {
      return PlayersMap.value.get(id);
    }

    function getRandomInt(min: number, max: number) {
      // 生成一个范围为 [min, max] 的随机整数
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    watch(treeHeight, updateTree);

    // 观察 players 的变化并更新 PlayersMap
    watch(players, (newPlayers) => {
      updatePlayersMap();
    }, { deep: true });

    return {
      backgroundImageUrl,
      treeHeight,
      rootNode,
      updateTree,
      players,
      loading,
      handleClick,
      changeLeafNodes,
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

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.inner_items{
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  flex-direction: column;
  margin-top: 2.5%;
  height: 60%;
  justify-content: center; /* Center items horizontally */
  align-items: center;
}

.absolute_temp_container{
  display: block;
  flex-wrap: wrap;
  flex-direction: column;
  position: absolute;
  margin-top: 12.5%;
  height: 90%;
  align-items: center;
}

.players-grid {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.loading {
  text-align: center;
  font-size: 1.5em;
  color: #666;
}

</style>
