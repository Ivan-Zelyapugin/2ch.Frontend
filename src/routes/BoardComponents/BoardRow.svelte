<script>
// @ts-nocheck

    export let board;
    export let updateBoard;
    export let deleteBoard;
  </script>
  
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
  