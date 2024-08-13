<script>
    export let thread;
    export let isImage;
    export let getFileUrl;
    export let updateThread;
    export let deleteThread;
  </script>
  
  <div class="bg-gray-100 p-4 mb-4 rounded shadow">
    <h2 class="text-xl font-bold mb-2">
      <a href={`/boards/${thread.boardId}/threads/${thread.threadId}`} class="text-blue-500 underline">{thread.title}</a>
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
  