<template>
  <div class="container">
    <header>
      <h1>抽签系统</h1>
      <p>Roll it ! ! !</p>
    </header>

    <nav>
      <ul>
        <li><router-link to="/TournamentDraw/knockout">淘汰赛抽签</router-link></li>
        <li><router-link to="/TournamentDraw/nvsn">N vs N 比赛抽签</router-link></li>
        <li><router-link to="/TournamentDraw/launch">晚饭吃什么抽签</router-link></li>
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
}

nav li {
  display: block;
  margin: 20px 20px;
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
