<script>
    import BoardRow from './BoardRow.svelte';
  
    /**
	 * @type {any[]}
	 */
    export let boards = [];
    export let updateBoard;
    export let deleteBoard;
  </script>
  
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
        <BoardRow {board} {updateBoard} {deleteBoard} />
      {/each}
    </tbody>
  </table>
  