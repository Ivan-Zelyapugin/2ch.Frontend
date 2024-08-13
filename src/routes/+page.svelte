<script>
  import { onMount } from 'svelte';
  
  import BoardForm from '../lib/BoardComponents/BoardForm.svelte';
  import BoardTable from '../lib/BoardComponents/BoardTable.svelte';

  /**
	 * @type {never[]}
	 */
  let boards = [];

  const API_URL = "http://localhost:8080/";

  async function initializeUser() {
    try {
      const response = await fetch(`${API_URL}api/AnonymousUser`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`Пользователь инициализирован с UserId: ${data.userId}`);
      } else {
        console.error("Ошибка инициализации пользователя:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  async function refreshBoard() {
    try {
      const response = await fetch(`${API_URL}api/Boards/`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        boards = data;
      } else {
        console.error("Ошибка получения досок:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  /**
	 * @param {any} BoardName
	 * @param {any} BoardDescription
	 */
  async function addBoard(BoardName, BoardDescription) {
    try {
      const response = await fetch(`${API_URL}api/Boards/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: BoardName, description: BoardDescription })
      });
      if (response.ok) {
        refreshBoard(); 
      } else {
        console.error("Ошибка при добавлении доски:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  /**
	 * @param {any} id
	 */
  async function deleteBoard(id) {
    try {
      const response = await fetch(`${API_URL}api/Boards/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        refreshBoard();
      } else {
        console.error("Ошибка при удалении доски:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  /**
	 * @param {any} id
	 * @param {any} name
	 * @param {any} description
	 */
  async function updateBoard(id, name, description) {
    try {
      const response = await fetch(`${API_URL}api/Boards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, description })
      });
      if (response.ok) {
        refreshBoard();
      } else {
        console.error("Ошибка при обновлении доски:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  onMount(() => {
    initializeUser().then(() => {
      refreshBoard();
    });
  });
</script>

<main class="container mx-auto p-4 bg-white shadow rounded">
  <h1 class="text-2xl font-bold mb-4">
    <a href="/" class="text-blue-500 underline">2ch app</a>
  </h1>

  <p>Два.ч - это система форумов, где можно общаться быстро и свободно...</p>

  <BoardForm 
    addBoard={addBoard} 
  />

  <BoardTable 
    boards={boards} 
    updateBoard={updateBoard} 
    deleteBoard={deleteBoard} 
  />
</main>

<style>
  main {
    background-color: #f7f7f7;
    padding: 20px;
    border-radius: 10px;
  }
</style>
