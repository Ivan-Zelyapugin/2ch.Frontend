<script>
// @ts-nocheck

    let ThreadName = '';
    let ThreadDescription = '';
    let ThreadFile = null;
    export let addThread;
  </script>
  
  <div class="mb-4">
    <input type="text" placeholder="Заголовок треда" bind:value={ThreadName} class="border p-2 mr-2" />
    <input type="text" placeholder="Описание треда" bind:value={ThreadDescription} class="border p-2 mr-2" />
    <input type="file" on:change={(e) => ThreadFile = e.target.files[0]} class="border p-2 mr-2" />
    <button on:click={() => addThread(ThreadName, ThreadDescription, ThreadFile)} class="bg-blue-500 text-white p-2">Добавить тред</button>
  </div>
  