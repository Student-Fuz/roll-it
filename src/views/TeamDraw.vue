<template>
  <div class="general_container" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="absolute_temp_container">
      <!-- **********************定义组件开始*********************** -->
      <div class="inner_items">
        <h1>团队抽签</h1>

        <!-- 抽出双方展示区域 -->
        <div class="teams-container">
          <!-- 左队 -->
          <div class="team team-left">
            <h2>队伍 A</h2>
            <PlayerCard
              v-for="player in teamA"
              :key="player.id"
              :nickname="player.nickname"
              :avatarUrl="player.avatarUrl"
              :slogan="player.slogan"
            />
          </div>

          <!-- 右队 -->
          <div class="team team-right">
            <h2>队伍 B</h2>
            <PlayerCard
              v-for="player in teamB"
              :key="player.id"
              :nickname="player.nickname"
              :avatarUrl="player.avatarUrl"
              :slogan="player.slogan"
            />
          </div>
        </div>

        <!-- 添加按钮，点击时调用 GeneralDraw 函数 -->
        <button @click="drawTeams">一键抽签</button>
        <h2>比赛选手展示</h2>
        <AddPlayerModal
          :show="showModal"
          @close="showModal = false"
          @add-player="handleAddingPlayer"
        />

        <div class="gray-note">
          注：双击删除选项
        </div>

        <div class="players-grid">
          <PlayerCard
            v-for="player in players"
            :key="player.id"
            :nickname="player.nickname"
            :avatarUrl="player.avatarUrl"
            :slogan="player.slogan"
            @playerRemove="deletePlayer(player.id)"
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
  name: 'teamDraw',
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
    const teamA = ref<any[]>([]);
    const teamB = ref<any[]>([]);

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

    // 随机抽签函数，将玩家分配到两队
    const drawTeams = () => {
      const shuffledPlayers = [...players.value].sort(() => Math.random() - 0.5);
      const half = Math.ceil(shuffledPlayers.length / 2);
      teamA.value = shuffledPlayers.slice(0, half);
      teamB.value = shuffledPlayers.slice(half);
    };

    // 删除选手
    const deletePlayer = (playerId: number) => {
      console.log("hello")
      players.value = players.value.filter(player => player.id !== playerId);
    };

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
      teamA,
      teamB,
      handleAddingPlayer,
      drawTeams,
      deletePlayer
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

.inner_items{
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  flex-direction: column;
  margin-top: 10px;
  align-items: center;
  z-index: 1; /* 保证其他元素能在弹幕后方显示 */
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

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f6f7f6;
  color: rgb(12, 12, 12);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.teams-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 20px 0;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gray-note {
  color: gray; /* 灰色字体 */
  font-size: 12px; /* 较小字体 */
  margin-bottom: 10px; /* 下方留出空间 */
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
