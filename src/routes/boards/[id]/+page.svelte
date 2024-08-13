<script>
// @ts-nocheck

  import { onMount } from 'svelte';

  import { page } from '$app/stores';
  import ThreadForm from '../../../lib/ThreadComponents/ThreadForm.svelte';
  import ThreadItem from '../../../lib/ThreadComponents/ThreadItem.svelte';

  const baseUrl = 'http://localhost:9000';
  let API_URL = "http://localhost:8080/";

  let threads = [];

  let boardId;

  $: boardId = $page.url.pathname.split('/')[2];

  async function isImage(filePath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some(ext => filePath.endsWith(ext));
  }

  function getFileUrl(filePath) {
    const normalizedPath = filePath.replace(/^\/+/, ''); 
    return (`${baseUrl}/${normalizedPath}`);
  }

  async function addThread(ThreadName, ThreadDescription, ThreadFile) {
    try {
        const formData = new FormData();
        formData.append('title', ThreadName);
        formData.append('content', ThreadDescription);
        if (ThreadFile) {
            formData.append('file', ThreadFile);
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

  async function refreshThreads() {
    try {
      const response = await fetch(`${API_URL}api/Threads?boardId=${boardId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        threads = await response.json();
      } else {
        console.error("Ошибка получения тредов:", response.status, response.statusText);
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
</script>

<main class="container mx-auto p-4 bg-white shadow rounded">
  <h1 class="text-2xl font-bold mb-4">
    <a href="/" class="text-blue-500 underline">2ch app</a>
  </h1>

  <p>Два.ч - это система форумов, где можно общаться быстро и свободно...</p>
  <p>Тут расположены посты данной доски</p>

  <ThreadForm 
    {addThread} 
  />

  {#each threads as thread}
    <ThreadItem 
      {thread} 
      {isImage} 
      {getFileUrl} 
      {updateThread} 
      {deleteThread} 
    />
  {/each}
</main>
