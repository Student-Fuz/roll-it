<template>
    <div class="player-card">
      <img :src="avatarUrl" alt="avatar" class="player-avatar" />
      <h3 class="player-nickname">{{ nickname }}</h3>
      <p class="player-slogan">{{ slogan }}</p>
      <button @click="onDraw">抽签</button>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
name: 'PlayerCard',
props: {
    avatarUrl: {
    type: String as PropType<string>,
    required: true
    },
    nickname: {
    type: String as PropType<string>,
    required: true
    },
    slogan: {
    type: String as PropType<string>,
    required: true
    },
    onDraw: {
      type: Function as PropType<() => void>, // 明确定义为无返回值的函数类型
      required: true
    }   
}



});
</script>

<style scoped>
.player-card {
border: 1px solid #ddd;
border-radius: 8px;
padding: 16px;
text-align: center;
width: 200px;
height: 240px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.player-avatar {
width: 100px;
height: 100px;
border-radius: 50%;
object-fit: cover;
}

.player-nickname {
font-size: 1.2em;
margin-top: 10px;
color: #333;
}

.player-slogan {
font-size: 0.9em;
margin-top: 8px;
color: #666;
}
</style>
  