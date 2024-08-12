<script>
// @ts-nocheck

    let CommentContent = '';
    let CommentFile = null;
    export let addComment;
</script>

<div class="mt-4">
    <h2 class="text-xl font-semibold mb-2">Добавить комментарий</h2>
    
    <textarea
        class="w-full p-2 border rounded"
        rows="4"
        bind:value={CommentContent}
        placeholder="Введите комментарий..."
    ></textarea>
    
    <input type="file" on:change={(e) => CommentFile = e.target.files[0]} class="border p-2 mr-2" />
    
    <button
        class="mt-2 bg-blue-500 text-white p-2 rounded"
        on:click={()=>addComment(CommentContent, CommentFile)}
    >
        Отправить
    </button>
  </div>