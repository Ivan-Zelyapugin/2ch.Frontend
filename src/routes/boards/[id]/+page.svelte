<script>
// @ts-nocheck

  import {onMount} from 'svelte';
  import { page } from '$app/stores'; 

  const baseUrl = 'http://localhost:9000';

  let name = "2ch app";
  let API_URL = "http://localhost:8080/";

  /**
  * @type {any[]}
  */
  let threads =[];
  let newThreadName ='';
  let newThreadDescription = '';
  let newThreadFile;

  let boardId;

  $: boardId = $page.url.pathname.split('/')[2];  

  function isImage(filePath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some(ext => filePath.endsWith(ext));
  }

  function getFileUrl(filePath) {
    const normalizedPath = filePath.replace(/^\/+/, ''); // Удаляем начальные слэши
    console.log(`${baseUrl}/${normalizedPath}`);
    return `${baseUrl}/${normalizedPath}`;
  }

  async function initializeUser() {
    try {
      const response = await fetch(`${API_URL}api/AnonymousUser`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        
      } else {
        console.error("Ошибка инициализации пользователя:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  async function refreshThreads() {
    try {
      const response = await fetch(`${API_URL}api/Threads?boardId=${boardId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        threads = data;
      } else {
        console.error("Ошибка получения тредов:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  async function addThread() {
    try {
        const formData = new FormData();
        formData.append('title', newThreadName);
        formData.append('content', newThreadDescription);
        if (newThreadFile) {
            formData.append('file', newThreadFile);
        }

        const response = await fetch(`${API_URL}api/Threads?boardId=${boardId}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            refreshThreads();
        } else {
            console.error("Ошибка при добавлении треда:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Ошибка соединения:", error);
    }
  }

  /**
  * @param {any} id
  */
  async function deleteThread(id) {
    try {
      const response = await fetch(`${API_URL}api/Threads/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        refreshThreads();
      } else {
        console.error("Ошибка при удалении треда:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  /**
  * @param {any} id
  * @param {any} title
  * @param {any} content
  */
  async function updateThread(id, title, content) {
    try {
      const response = await fetch(`${API_URL}api/Threads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content })
      });
      if (response.ok) {
        refreshThreads();
      } else {
        console.error("Ошибка при обновлении треда:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
    }
  }

  onMount(() => {
    initializeUser().then(() => {
      refreshThreads();
    });
  });
</script>

<main class="container mx-auto p-4 bg-white shadow rounded">
  <h1 class="text-2xl font-bold mb-4">
    <a href="/" class="text-blue-500 underline">2ch app</a>
  </h1>

  <p>Два.ч - это система форумов, где можно общаться быстро и свободно...</p>
  <p>Тут расположены посты данной доски</p>

  <div class="mb-4">
    <input type="text" placeholder="Заголовок треда" bind:value={newThreadName} class="border p-2 mr-2" />
    <input type="text" placeholder="Описание треда" bind:value={newThreadDescription} class="border p-2 mr-2" />
    <input type="file" on:change={(e) => newThreadFile = e.target.files[0]} class="border p-2 mr-2" />
    <button on:click={addThread} class="bg-blue-500 text-white p-2">Добавить тред</button>
  </div>

  {#each threads as thread}
    <div class="bg-gray-100 p-4 mb-4 rounded shadow">
      <h2 class="text-xl font-bold mb-2">
        <a href={`/boards/${boardId}/threads/${thread.threadId}`} class="text-blue-500 underline">{thread.title}</a>
      </h2>
      <p class="text-gray-700 mb-4">{thread.content}</p>
      {#if thread.filePath}
        <p class="text-sm text-gray-500 mb-4">
          {#if isImage(thread.filePath)}
          <img src={getFileUrl(thread.filePath)} alt="Uploaded file" />
        {:else}
            <a href={getFileUrl(thread.filePath)} target="_blank" class="text-blue-500 underline">Файл</a>
        {/if}
        </p>
      {/if}
      <div class="text-sm text-gray-600 mb-4">Автор: {thread.userId}</div>
      <div class="text-sm text-gray-600 mb-4">Дата: {thread.createdAt}</div>
      <div class="flex space-x-2">
        <button on:click={() => updateThread(thread.threadId, thread.title, thread.content)} class="bg-green-500 text-white p-2 rounded">Обновить</button>
        <button on:click={() => deleteThread(thread.threadId)} class="bg-red-500 text-white p-2 rounded">Удалить</button>
      </div>
    </div>
  {/each}
</main>