<template>
    <div class="modal" v-if="show">
      <div class="modal-content">
        <h2>添加选手</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nickname">昵称:</label>
            <input v-model="nickname" type="text" id="nickname" required />
          </div>
  
          <div class="form-group">
            <label for="slogan">口号:</label>
            <input v-model="slogan" type="text" id="slogan" required />
          </div>
  
          <div class="form-group">
            <label for="avatar">选择头像:</label>
            <input @change="handleFileChange" type="file" id="avatar" accept="image/*" required />
          </div>
  
          <div class="modal-actions">
            <button type="submit">添加</button>
            <button @click="closeModal">取消</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'AddPlayerModal',
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    emits: ['close', 'add-player'],
    setup(props, { emit }) {
      const nickname = ref<string>('');
      const slogan = ref<string>('');
      const avatarUrl = ref<string>('');
  
      const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            avatarUrl.value = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }
      };
  
      const submitForm = () => {
        if (nickname.value && slogan.value && avatarUrl.value) {
          emit('add-player', { nickname: nickname.value, slogan: slogan.value, avatarUrl: avatarUrl.value });
          closeModal();
        }
      };
  
      const closeModal = () => {
        emit('close');
      };
  
      return {
        nickname,
        slogan,
        avatarUrl,
        handleFileChange,
        submitForm,
        closeModal
      };
    }
  });
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2; /* 保证其他元素能在弹幕后方显示 */
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
  }
  </style>
  