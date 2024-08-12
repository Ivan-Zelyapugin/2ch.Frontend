<script>
    export let replyingToCommentId;
    /**
	 * @type {any}
	 */
    let ReplyContent;
    export let addReply;
</script>

<div class="ml-8 mt-4">
    <textarea
        class="w-full p-2 border rounded"
        rows="2"
        bind:value={ReplyContent}
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