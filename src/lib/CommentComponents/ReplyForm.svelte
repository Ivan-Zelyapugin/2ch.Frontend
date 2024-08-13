<script>
    /**
	 * @type {null}
	 */
     export let replyingToCommentId;
    let ReplyContent = '';
    /**
	 * @type {(arg0: string, arg1: null) => void}
	 */
     export let addReply;

    function handleAddReplyComment() {
        addReply(ReplyContent, replyingToCommentId);
        ReplyContent = ''; 
        replyingToCommentId = null;   
    }

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
        on:click={handleAddReplyComment}
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