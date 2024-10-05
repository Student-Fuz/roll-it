<template>
  <div class="app">
    <img :src="backgroundImageUrl">
    <div class="absolute_temp_container">
      <!-- 弹幕容器 -->
      <div class="barrage-container">
        <div
          v-for="(barrage, index) in barrages"
          :key="index"
          class="barrage-message"
          :style="{ top: getRandomTop(index) + 'px', 
          animationDuration: getRandomSpeed() + 's',
          color: getRandomColor() }"
        >
          {{ barrage.barrage }}
        </div>
      </div>

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
        <!-- 添加按钮，点击时调用 GeneralDraw 函数 -->
        <button @click="handleGeneralDraw">一键抽签</button>
        <h2>比赛选手展示</h2>
        <AddPlayerModal
          :show="showModal"
          @close="showModal = false"
          @add-player="handleAddingPlayer"
        />
        <div class="players-grid">
          <PlayerCard
            v-for="player in players"
            :key="player.id"
            :nickname="player.nickname"
            :avatarUrl="player.avatarUrl"
            :slogan="player.slogan"
            :onDraw="() => handleIndividualDraw(player)"
          />
          <AddingPlayerCard
            :avatarUrl="balnkPlayerUrl"
            @onAdd="showModal = true"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import BinaryTreeNode from '../components/BinaryTreeNode.vue';
import type { TreeNode } from '../types/TreeNode'; 
import type { Player } from '../types/Player'; 
import type { Barrage } from '../types/Barrage'; 
import PlayerCard from '../components/PlayerCard.vue';
import AddingPlayerCard from '../components/AddingPlayerCard.vue';
import AddPlayerModal from '../components/AddPlayerModal.vue';

export default defineComponent({
  name: 'KnockoutDraw',
  components: {
    BinaryTreeNode, 
    PlayerCard,
    AddingPlayerCard,
    AddPlayerModal
  },
  setup() {
    const backgroundImageUrl = ref<string>('background.png');
    const playersListUrl = ref<string>('players.json');
    const barragesListUrl = ref<string>('barrages.json');
    const defaultPlayerUrl = ref<string>('avatars/default.png');
    const balnkPlayerUrl = ref<string>('avatars/blank.png');
    const undeterminedPlayerUrl = ref<string>('avatars/undetermined.png');
    const defaultHeight = 3;
    const treeHeight = ref<number>(defaultHeight);
    const rootNode = ref<TreeNode | null>(generateBinaryTree(treeHeight.value, 0, null));
    const players = ref<Player[]>([]);  
    const PlayersMap = ref<Map<number, Player>>(new Map()); 
    const loading = ref(true);
    const barrages = ref<Barrage[]>([]);

    const showModal = ref(false);


    // 抽签相关
    // 索引数组indexArray 存放0.....index
    let indexArray = ref(Array.from({ length: 2**treeHeight.value }, (_, index) => index));
    const seatArray = ref<TreeNode[]>(getLeafNodes(rootNode.value));

    // 读取选手信息
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

    // 读取弹幕消息
    const fetchBarrages = async () => {
      try {
        const response = await fetch(barragesListUrl.value);
        if (!response.ok) {
          throw new Error('Failed to fetch barrage data');
        }
        barrages.value = await response.json();
      } catch (error) {
        console.error('Error loading barrages:', error);
      } finally {
        loading.value = false;
      }
    };

    // 初始化
    onMounted(() => {
      fetchPlayers();  
      fetchBarrages();
    });

    // ******************比赛树部分（开始）*******************
    // 递归地生成完全二叉树
    function generateBinaryTree(h: number, level: number = 0, fatherNode: TreeNode | null = rootNode.value): TreeNode | null {
      if (level > h) return null;
      const currNode: TreeNode = {
        heightReverse: h - level,
        avatarUrl: undeterminedPlayerUrl.value,
        nickname: "待定",
        father: fatherNode,
        left: null,
        right: null,
      };
      currNode.left = generateBinaryTree(h, level + 1, currNode);
      currNode.right = generateBinaryTree(h, level + 1, currNode);
      return currNode;
    }

    // 递归遍历清空完全二叉树
    function clearBinaryTree(node: TreeNode | null = rootNode.value) {
      if (!node) return;
      else {
        // 重置node
        node.avatarUrl = undeterminedPlayerUrl.value;
        node.nickname = "待定";
        // 递归遍历左右子树
        if (node.left) clearBinaryTree(node.left);
        if (node.right) clearBinaryTree(node.right);
      }
    }

    function getLeafNodes(rootNode: TreeNode | null): TreeNode[] {
      const leafNodes: TreeNode[] = [];
      if (!rootNode) return leafNodes;
      
      const queue: TreeNode[] = [rootNode];
      
      while (queue.length > 0) {
        const node = queue.shift()!;
        
        if (!node.left && !node.right) {
          // 这是一个叶子节点
          leafNodes.push(node);
        } else {
          // 将子节点加入队列
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
        }
      }
      return leafNodes;
    }

    // 递归遍历二叉树并修改叶子节点
    function GeneralDraw(node: TreeNode | null = rootNode.value) {
      if (!node) return;
      if (!node.left && !node.right) {
        // 这是一个叶子节点
        let rand = getRandomInt(0, indexArray.value.length-1);
        let item = getPlayerById(indexArray.value[rand]+1);
        indexArray.value.splice(rand,1);
        node.avatarUrl = item?.avatarUrl as string;
        node.nickname = item?.nickname as string;
      } else {
        // 递归遍历左右子树
        if (node.left) GeneralDraw(node.left);
        if (node.right) GeneralDraw(node.right);
      }
    }

    function getPlayerById(id: number) {
      return PlayersMap.value.get(id);
    }

    function getRandomInt(min: number, max: number) {
      // 生成一个范围为 [min, max] 的随机整数
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 一键抽签
    function handleGeneralDraw(event: MouseEvent) {
      clearBinaryTree();
      indexArray = ref(Array.from({ length: 2**treeHeight.value }, (_, index) => index));
      GeneralDraw();
      indexArray = ref(Array.from({ length: 2**treeHeight.value }, (_, index) => index));
    }

    // 单个抽签
    const handleIndividualDraw = (player : Player) => {
      if(indexArray.value.length == 0){
        clearBinaryTree();
        indexArray = ref(Array.from({ length: 2**treeHeight.value }, (_, index) => index));
      }
      let rand = getRandomInt(0, indexArray.value.length-1);
      seatArray.value[indexArray.value[rand]].avatarUrl = player.avatarUrl;
      seatArray.value[indexArray.value[rand]].nickname = player.nickname;
      indexArray.value.splice(rand, 1);
      console.log(indexArray.value)
    };

    // 递归地生成完全二叉树
    function updateTree() {
      rootNode.value = generateBinaryTree(treeHeight.value, 0, null);
      seatArray.value = [];
      seatArray.value = getLeafNodes(rootNode.value);
      indexArray = ref(Array.from({ length: 2**treeHeight.value }, (_, index) => index));
    }

    watch(treeHeight, updateTree);

    // ******************比赛树部分（结束）*******************

    // ******************选手展示部分（开始）*******************
    // 更新 PlayersMap 的函数
    function updatePlayersMap() {
      PlayersMap.value = new Map(players.value.map(item => [item.id, item]));
    }

    // 观察 players 的变化并更新 PlayersMap
    watch(players, (newPlayers) => {
      updatePlayersMap();
    }, { deep: true });

    // 添加选手
    const handleAddingPlayer = (newPlayer: { nickname: string; slogan: string; avatarUrl: string }) => {
      let player = {
        id : 1,
        nickname : newPlayer.nickname,
        slogan : newPlayer.slogan,
        avatarUrl : newPlayer.avatarUrl,
      }
      players.value.push(player);
      showModal.value = false;
    };

    // ******************选手展示部分（结束）*******************

    // ******************弹幕相关（开始）*******************
    const addBarrage = (message: Barrage) => {
      barrages.value.push(message);
      // 保持弹幕数量，不要过多
      if (barrages.value.length > 100) {
        barrages.value.shift();
      }
    };

    const getRandomTop = (index: number) => {
      // 弹幕随机显示的高度，防止重叠
      return Math.floor(Math.random() * (100));
    };

    const getRandomSpeed = () => {
      // 随机速度，增加弹幕滚动的多样性
      return Math.random() * 5 + 5;
    };

    // 生成随机颜色
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    // ******************弹幕相关（结束）*******************

    return {
      backgroundImageUrl,
      treeHeight,
      rootNode,
      players,
      loading,
      barrages,
      defaultPlayerUrl,
      balnkPlayerUrl,
      showModal,
      updateTree,
      handleGeneralDraw,
      handleIndividualDraw,
      GeneralDraw,
      addBarrage,
      getRandomTop,
      getRandomSpeed,
      getRandomColor, 
      handleAddingPlayer
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
  z-index: 1; 
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  z-index: 1; 
}

.inner_items{
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  flex-direction: column;
  margin-top: 10px;
  justify-content: center; /* Center items horizontally */
  align-items: center;
  z-index: 1; /* 保证其他元素能在弹幕后方显示 */
}

.absolute_temp_container{
  display: block;
  flex-wrap: wrap;
  flex-direction: column;
  position: absolute;
  margin-top: 180px;
  height: 90%;
  align-items: center;
  z-index: 1; /* 保证其他元素能在弹幕后方显示 */
}

.players-grid {
  display: flex;
  gap: 20px;
  width: 80%;
  justify-content: center;
  flex-wrap: wrap;
}

.loading {
  text-align: center;
  font-size: 1.5em;
  color: #666;
}

/* 弹幕 */
.barrage-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 116px; /* 限定弹幕的活动范围 */
  pointer-events: none; /* 避免弹幕阻挡点击 */
  overflow: hidden;
  z-index: 1000; /* 使弹幕浮空在所有元素上方 */
}

.barrage-message {
  position: absolute;
  left: 100%;
  white-space: nowrap; /* 保证弹幕不换行 */
  color: rgb(31, 30, 30);
  font-size: 16px;
  animation: scroll-left linear infinite;
  /* 增加动画持续时间，可以让滚动看起来更平滑 */
  animation-duration: 100s; /* 根据需求调整时间 */
}

@keyframes scroll-left {
  0% {
    transform: translateX(100% + 100vw);
  }
  100% {
    transform: translateX(-100vw);
  }
}

</style>
