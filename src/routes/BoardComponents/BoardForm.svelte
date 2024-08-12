<script>
    let BoardName = '';
    let BoardDescription = '';
    export let addBoard;
  </script>
  
  <div class="mb-4">
    <input type="text" placeholder="Название доски" bind:value={BoardName} class="border p-2 mr-2" />
    <input type="text" placeholder="Описание доски" bind:value={BoardDescription} class="border p-2 mr-2" />
    <button on:click={() => addBoard(BoardName, BoardDescription)} class="bg-blue-500 text-white p-2">Добавить доску</button>
  </div>
  