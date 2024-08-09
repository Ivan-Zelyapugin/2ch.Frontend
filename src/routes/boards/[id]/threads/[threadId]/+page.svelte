<script>
  // @ts-nocheck
  import {onMount} from 'svelte';
  import { page } from '$app/stores'; 

  let name = "2ch app";
  let API_URL = "http://localhost:8080/";
  const baseUrl = 'http://localhost:9000';

  let comments = [];
  let newCommentContent = '';
  let newCommentFile;
  let newReplyContent = '';
  let replyingToCommentId = null;

  let thread;
  let threadId;

  $: threadId = $page.url.pathname.split('/')[4];

  async function getThread() {
      try {
          const response = await fetch(`${API_URL}api/Threads/${threadId}`, {
              credentials: 'include'
          });
          if (response.ok) {
              const data = await response.json();
              thread = data;
          } else {
              console.error("Ошибка получения треда:", response.status, response.statusText);
          }
      } catch (error) {
          console.error("Ошибка соединения:", error);
      }
  }

  function isImage(filePath) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      return imageExtensions.some(ext => filePath.endsWith(ext));
  }

  function getFileUrl(filePath) {
      const normalizedPath = filePath.replace(/^\/+/, ''); // Удаляем начальные слэши
      return `${baseUrl}/${normalizedPath}`;
  }

  async function initializeUser() {
      try {
          const response = await fetch(`${API_URL}api/AnonymousUser`, {
              credentials: 'include'
          });
          if (response.ok) {
              const data = await response.json();
              // Обработайте данные, если нужно
          } else {
              console.error("Ошибка инициализации пользователя:", response.status, response.statusText);
          }
      } catch (error) {
          console.error("Ошибка соединения:", error);
      }
  }

  async function refreshComments() {
      try {
          const response = await fetch(`${API_URL}api/Comments?threadId=${threadId}`, {
              credentials: 'include'
          });
          if (response.ok) {
              const data = await response.json();
              comments = data;
          } else {
              console.error("Ошибка получения комментариев:", response.status, response.statusText);
          }
      } catch (error) {
          console.error("Ошибка соединения:", error);
      }
  }

  async function addComment() {
      try {
          const formData = new FormData();
          formData.append('content', newCommentContent);
          if (newCommentFile) {
              formData.append('file', newCommentFile);
          }

          const response = await fetch(`${API_URL}api/Comments?id=${threadId}`, {
              method: 'POST',
              credentials: 'include',
              body: formData
          });

          if (response.ok) {
              refreshComments();
              newCommentContent = '';
              newCommentFile = null;
          } else {
              console.error("Ошибка при добавлении комментария:", response.status, response.statusText);
          }
      } catch (error) {
          console.error("Ошибка соединения:", error);
      }
  }

  async function replyToComment(commentId, userId) {
      replyingToCommentId = commentId;
      newReplyContent = '';
  }

  async function addReply() {
      if (!replyingToCommentId) return;

      try {
          const formData = new FormData();
          formData.append('content', newReplyContent);
          formData.append('parentCommentId', replyingToCommentId);

          const response = await fetch(`${API_URL}api/Comments?id=${threadId}`, {
              method: 'POST',
              credentials: 'include',
              body: formData
          });

          if (response.ok) {
              refreshComments();
              newReplyContent = '';
              replyingToCommentId = null;
          } else {
              console.error("Ошибка при добавлении ответа:", response.status, response.statusText);
          }
      } catch (error) {
          console.error("Ошибка соединения:", error);
      }
  }

  async function deleteComment(id) {
      try {
          const response = await fetch(`${API_URL}api/Comments/${id}`, {
              method: 'DELETE',
              credentials: 'include'
          });
          if (response.ok) {
              refreshComments();
          } else {
              console.error("Ошибка при удалении :", response.status, response.statusText);
          }
      } catch (error) {
          console.error("Ошибка соединения:", error);
      }
  }

  onMount(() => {
      initializeUser().then(() => {
          refreshComments();
          getThread();
      });
  });

  function findReplies(parentId) {
    
    
    console.log(comments.filter(comment => comment.parentCommentId === parentId))
    console.log(parentId)
      return comments.filter(comment => comment.parentCommentId === parentId);
  }
</script>


<main class="container mx-auto p-4 bg-white shadow rounded">
  <h1 class="text-2xl font-bold mb-4">
      <a href="/" class="text-blue-500 underline">2ch app</a>
  </h1>
  
  {#if thread}
      <div class="bg-gray-100 p-4 mb-4 rounded shadow">
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
          <div class="text-sm text-gray-600 mb-4">Дата: {new Date(thread.createdAt).toLocaleDateString()}</div>
      </div>
  
      <!-- Секция для отображения комментариев -->
      <section class="comments">
        {#if comments.length > 0}
            {#each comments.filter(comment => !comment.parentCommentId) as comment (comment.commentId)}
                <div class="bg-gray-100 p-4 mb-4 rounded shadow">
                    <div class="text-sm text-gray-600 mb-2">
                        Автор: {comment.userId} | Дата: {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                    <p class="text-gray-700 mb-2">
                        {#if comment.replyTo}
                            Ответ на комментарий от {comment.replyToUserId}: {comment.content}
                        {:else}
                            {comment.content}
                        {/if}
                    </p>
                    {#if comment.filePath}
                        <p class="text-sm text-gray-500">
                            {#if isImage(comment.filePath)}
                                <img src={getFileUrl(comment.filePath)} alt="Uploaded file" />
                            {:else}
                                <a href={getFileUrl(comment.filePath)} target="_blank" class="text-blue-500 underline">Файл</a>
                            {/if}
                        </p>
                    {/if}
                    
                    <!-- Кнопки для удаления и ответа на комментарий -->
                    <div class="flex space-x-4 mt-2">
                        <button class="text-red-500 underline" on:click={() => deleteComment(comment.commentId)}>Удалить</button>
                        <button class="text-blue-500 underline" on:click={() => replyToComment(comment.commentId)}>Ответить</button>
                    </div>
    
                    <!-- Секция для отображения ответов на комментарий -->
                    {comment.commentId}
                    {#each findReplies(comment.commentId) as reply (reply.commentId)}
                    
                        <div class="ml-8 mt-4 bg-gray-200 p-4 rounded shadow">
                            <div class="text-sm text-gray-600 mb-2">
                                Автор: {reply.userId} | Дата: {new Date(reply.createdAt).toLocaleDateString()}
                            </div>
                            <p class="text-gray-700 mb-2">
                                {reply.content}
                            </p>
                            {#if reply.filePath}
                                <p class="text-sm text-gray-500">
                                    {#if isImage(reply.filePath)}
                                        <img src={getFileUrl(reply.filePath)} alt="Uploaded file" />
                                    {:else}
                                        <a href={getFileUrl(reply.filePath)} target="_blank" class="text-blue-500 underline">Файл</a>
                                    {/if}
                                </p>
                            {/if}
                            
                            <!-- Кнопки для удаления и ответа на ответ -->
                            <div class="flex space-x-4 mt-2">
                                <button class="text-red-500 underline" on:click={() => deleteComment(reply.commentId)}>Удалить</button>
                                <button class="text-blue-500 underline" on:click={() => replyToComment(reply.commentId)}>Ответить</button>
                            </div>
    
                            <!-- Форма для ответа на ответ -->
                            {#if replyingToCommentId === reply.commentId}
                                <div class="ml-8 mt-4">
                                    <textarea
                                        class="w-full p-2 border rounded"
                                        rows="2"
                                        bind:value={newReplyContent}
                                        placeholder="Введите ответ..."
                                    ></textarea>
                                    <button
                                        class="mt-2 bg-blue-500 text-white p-2 rounded"
                                        on:click={addReply}
                                    >
                                        Отправить ответ
                                    </button>
                                    <button
                                        class="mt-2 text-red-500 underline"
                                        on:click={() => {
                                            replyingToCommentId = null;
                                        }}
                                    >
                                        Отменить
                                    </button>
                                </div>
                            {/if}
                        </div>
                    {/each}
  
                    <!-- Форма для ответа на комментарий -->
                    {#if replyingToCommentId === comment.commentId}
                        <div class="ml-8 mt-4">
                            <textarea
                                class="w-full p-2 border rounded"
                                rows="2"
                                bind:value={newReplyContent}
                                placeholder="Введите ответ..."
                            ></textarea>
                            <button
                                class="mt-2 bg-blue-500 text-white p-2 rounded"
                                on:click={addReply}
                            >
                                Отправить ответ
                            </button>
                            <button
                                class="mt-2 text-red-500 underline"
                                on:click={() => {
                                    replyingToCommentId = null;
                                }}
                            >
                                Отменить
                            </button>
                        </div>
                    {/if}
                </div>
            {/each}
        {:else}
            <p class="text-gray-500">Комментариев пока нет.</p>
        {/if}
      </section>
  
      <!-- Форма для добавления комментария -->
      <div class="mt-4">
        <h2 class="text-xl font-semibold mb-2">Добавить комментарий</h2>
        
        <textarea
            class="w-full p-2 border rounded"
            rows="4"
            bind:value={newCommentContent}
            placeholder="Введите комментарий..."
        ></textarea>
        
        <input type="file" on:change={(e) => newCommentFile = e.target.files[0]} class="border p-2 mr-2" />
        
        <button
            class="mt-2 bg-blue-500 text-white p-2 rounded"
            on:click={addComment}
        >
            Отправить
        </button>
      </div>
  {:else}
      <p>Загрузка треда...</p>
  {/if}
  </main>
