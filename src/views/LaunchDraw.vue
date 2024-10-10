<template>
  <div class="general_container" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="absolute_temp_container">
      <!-- 抽签结果展示 -->
      <h1>中午吃什么抽签</h1>

      <!-- 显示 DishCard，无论是否已抽签 -->
      <div class="selected-player">
        <DishCard
          :nickname="selectedPlayer?.nickname || ''"
          :avatarUrl="selectedPlayer?.avatarUrl || blankPlayerUrl"
          :slogan="selectedPlayer?.slogan || ''"
        />
      </div>

      <!-- 一键抽签按钮 -->
      <button @click="startDraw">一键抽签</button>

      <h2>成电菜单大全</h2>
      <AddPlayerModal
        :show="showModal"
        @close="showModal = false"
        @add-player="handleAddingPlayer"
      />

      <!-- 展示所有选手的 DishCard -->
      <div class="players-grid">
        <DishCard
          v-for="player in players"
          :key="player.id"
          :nickname="player.nickname"
          :avatarUrl="player.avatarUrl"
          :slogan="player.slogan"
        />
        <AddingDishCard
          :avatarUrl="blankPlayerUrl"
          @onAdd="showModal = true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import type { Player } from '../types/Player';
import DishCard from '../components/DishCard.vue';
import AddingDishCard from '../components/AddingDishCard.vue';
import AddPlayerModal from '../components/AddPlayerModal.vue';

export default defineComponent({
  name: 'LaunchDraw',
  components: {
    DishCard,
    AddingDishCard,
    AddPlayerModal
  },
  setup() {
    const backgroundImageUrl = ref<string>('background_0.png');
    const playersListUrl = ref<string>('menu.json');
    const blankPlayerUrl = ref<string>('avatars/blank.png');
    const players = ref<Player[]>([]);
    const selectedPlayer = ref<Player | null>(null);
    const showModal = ref(false);
    const drawing = ref(false);
    let timerId: number | null = null;
    let delay = 10; // 初始切换速度

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
      }
    };

    // 初始化
    onMounted(() => {
      fetchPlayers();
    });

    // 添加选手
    const handleAddingPlayer = (newPlayer: Player) => {
      players.value.push(newPlayer);
      showModal.value = false;
    };

    // 开始抽签过程
    const startDraw = () => {
      if (players.value.length === 0 || drawing.value) return; // 防止重复抽签
      drawing.value = true;
      delay = 10; // 重置速度
      rollPlayers();
    };

    // 递减速度的滚动抽签
    const rollPlayers = () => {
      timerId = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * players.value.length);
        selectedPlayer.value = players.value[randomIndex];

        if (delay < 1000) {
          delay += 100; // 每次延长间隔时间，减慢速度
          rollPlayers(); // 继续滚动
        } else {
          drawing.value = false; // 结束抽签
          clearTimeout(timerId!);
        }
      }, delay);
    };

    return {
      backgroundImageUrl,
      players,
      blankPlayerUrl,
      selectedPlayer,
      showModal,
      handleAddingPlayer,
      startDraw
    };
  }
});
</script>

<style scoped>
/* 样式代码保持不变 */
.general_container {
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.absolute_temp_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 180px;
  z-index: 1;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.selected-player {
  margin-top: 20px;
}

.players-grid {
  display: flex;
  gap: 20px;
  width: 80%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
