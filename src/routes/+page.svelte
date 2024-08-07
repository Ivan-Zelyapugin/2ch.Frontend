<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  
  let name = "2ch app";
  let API_URL = "http://localhost:8080/";
  /**
  * @type {any[]}
  */
  let boards = [];
  let newBoardName = '';
  let newBoardDescription = '';
  
  async function initializeUser() {
    try {
      const response = await fetch(`${API_URL}api/AnonymousUser`, {
        credentials: 'include' // Включите учетные данные в запрос
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
        credentials: 'include' // Включите учетные данные в запрос
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
  
  async function addBoard() {
    try {
      const response = await fetch(`${API_URL}api/Boards/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Включите учетные данные в запрос
        body: JSON.stringify({ name: newBoardName, description: newBoardDescription })
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
        credentials: 'include' // Включите учетные данные в запрос
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
        credentials: 'include', // Включите учетные данные в запрос
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
  
    <div class="mb-4">
      <input type="text" placeholder="Название доски" bind:value={newBoardName} class="border p-2 mr-2" />
      <input type="text" placeholder="Описание доски" bind:value={newBoardDescription} class="border p-2 mr-2" />
      <button on:click={addBoard} class="bg-blue-500 text-white p-2">Добавить доску</button>
    </div>
  
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="p-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Доска</th>
          <th class="p-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Название</th>
          <th class="p-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Описание</th>
          <th class="p-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Автор</th>
          <th class="p-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">Действие</th>
        </tr>
      </thead>
      <tbody>
        {#each boards as board}
        <tr class="bg-gray-100">
          <td class="p-3 border-b border-gray-300">
            <a href={`/boards/${board.boardId}`} class="text-blue-500 underline">{board.boardId}</a>
          </td>
          <td class="p-3 border-b border-gray-300">
            <input type="text" bind:value={board.name} class="border p-2" on:change={(e) => updateBoard(board.boardId, e.target.value, board.description)} />
          </td>
          <td class="p-3 border-b border-gray-300">
            <input type="text" bind:value={board.description} class="border p-2" on:change={(e) => updateBoard(board.boardId, board.name, e.target.value)} />
          </td>
          <td class="p-3 border-b border-gray-300">{board.userId}</td>
          <td class="p-3 border-b border-gray-300">
            <button on:click={() => deleteBoard(board.boardId)} class="bg-red-500 text-white p-2">Удалить</button>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </main>
  
  <style>
    main {
      background-color: #f7f7f7;
      padding: 20px;
      border-radius: 10px;
    }
  </style>
  