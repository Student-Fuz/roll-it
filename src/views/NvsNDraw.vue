<template>
  <div class="general_container" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="absolute_temp_container">
      <!-- **********************定义组件开始*********************** -->
      <div class="inner_items">
        <h1>团队抽签</h1>
        <!-- 添加按钮，点击时调用 GeneralDraw 函数 -->
        <button>一键抽签</button>
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
          />
          <AddingPlayerCard
            :avatarUrl="blankPlayerUrl"
            @onAdd="showModal = true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- TODO 双击晋级 -->
<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import type { Player } from '../types/Player'; 
import PlayerCard from '../components/PlayerCard.vue';
import AddingPlayerCard from '../components/AddingPlayerCard.vue';
import AddPlayerModal from '../components/AddPlayerModal.vue';

export default defineComponent({
  name: 'KnockoutDraw',
  components: {
    PlayerCard,
    AddingPlayerCard,
    AddPlayerModal
  },
  setup() {
    const backgroundImageUrl = ref<string>('background_0.png');
    const playersListUrl = ref<string>('players.json');
    const defaultPlayerUrl = ref<string>('avatars/default.png');
    const blankPlayerUrl = ref<string>('avatars/blank.png');
    const players = ref<Player[]>([]);  
    const PlayersMap = ref<Map<number, Player>>(new Map()); 
    const loading = ref(true);

    const showModal = ref(false);

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

    // 初始化
    onMounted(() => {
      fetchPlayers();  
    });

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

    return {
      backgroundImageUrl,
      players,
      loading,
      defaultPlayerUrl,
      blankPlayerUrl,
      showModal, 
      handleAddingPlayer
    };
  }
});

</script>

<style scoped>
.general_container {
  display: flex;
  flex-direction: column;
  background-size: fixed; /* 使背景图充满容器 */
  background-position:center; /* 让背景图片居中 */
  position: relative;
  background-color: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
  box-shadow: 'light';
  align-items: center;
  justify-content: center;
}

.absolute_temp_container{
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 180px;
  height: 90%;
  align-items: center;
  z-index: 1; 
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
  align-items: center;
  z-index: 1; /* 保证其他元素能在弹幕后方显示 */
}

.competitionTree{
  display: flex;
}

.players-grid {
  display: flex;
  gap: 20px;
  width: 80%;
  justify-content: center;
  align-items: center;
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
