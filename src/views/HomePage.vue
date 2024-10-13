<template>
  <div class="container">
    <header>
      <h1>抽签系统</h1>
      <p>Roll it ! ! !</p>
    </header>

    <nav>
      <ul>
        <li><router-link to="/roll-it/knockout">淘汰赛抽签</router-link></li>
        <li><router-link to="/roll-it/nvsn">N vs N 比赛抽签</router-link></li>
        <li><router-link to="/roll-it/launch">中午吃什么抽签</router-link></li>
      </ul>
    </nav>

    <footer>
      <p>&copy; 抽签系统</p>
    </footer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.container {
  text-align: center;
  padding: 50px;
  background-color: #f9f9f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

header h1 {
  font-size: 2.5em;
  color: #333;
}

header p {
  font-size: 1.2em;
  color: #666;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 50px 0;
  display: flex;
  flex-direction: column; /* 使列表项竖直排列 */
  align-items: center; /* 水平居中 */
  width: 100%; /* 使导航栏宽度充满可用空间 */
}

nav li {
  display: flex;
  justify-content: center;
  margin: 20px 20px;
  width: 100%; /* 确保每个列表项占满整个容器宽度 */
}

/* 代码中使用的是 router-link 而不是传统的 <a> 标签。虽然你看不到明确的 <a> 标签，
但是 router-link 在渲染时实际上会生成 <a> 标签。 */
nav a {
  font-size: 1.5em;
  padding: 10px 20px;
  color: white;
  background-color: #007bff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center; /* 水平居中内容 */
  align-items: center; /* 垂直居中内容 */
  width: 100%; /* 使链接占满父元素的宽度 */
  max-width: 240px; /* 设置最大宽度，防止按钮过宽 */
  min-width: 200px; /* 设置最小宽度，防止按钮过窄 */
}

nav a:hover {
  background-color: #0056b3;
}



footer {
  margin-top: auto;
  font-size: 0.9em;
  color: #777;
}
</style>
