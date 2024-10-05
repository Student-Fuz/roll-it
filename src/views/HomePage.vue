<template>
  <div class="container">
    <header>
      <h1>比赛抽签系统</h1>
      <p>请选择比赛类型进入相应的页面</p>
    </header>

    <nav>
      <ul>
        <li><router-link to="/TournamentDraw/knockout">淘汰赛抽签</router-link></li>
        <li><router-link to="/TournamentDraw/nvsn">NvsN 比赛抽签</router-link></li>
      </ul>
    </nav>

    <footer>
      <p>&copy; 2024 比赛抽签系统</p>
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
}

nav li {
  display: inline-block;
  margin: 0 20px;
}

nav a {
  font-size: 1.5em;
  padding: 10px 20px;
  color: white;
  background-color: #007bff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
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
