<script>
    import ReplyForm from './ReplyForm.svelte';
    import Comment from './Comment.svelte';

    export let comment;
    export let deleteComment;
    export let isImage;
    export let getFileUrl;
    export let findReplies;
    export let addReply;
    /**
	 * @type {null}
	 */
     export let replyingToCommentId = null;
    /**
	 * @type {any}
	 */
    let ReplyContent

    let newReplyContent = '';
    /**
	 * @param {null} commentId
	 */
    async function replyToComment(commentId) {
        replyingToCommentId = commentId;
        newReplyContent = '';
    }
</script>

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
        <Comment
            comment={reply}
            {deleteComment}
            {isImage}
            {getFileUrl}
            {findReplies}
            {addReply}
        />
    {/each}

    <!-- Форма для ответа на комментарий -->
    {#if replyingToCommentId === comment.commentId}
        <div class="ml-8 mt-4">
            <textarea
                class="w-full p-2 border rounded"
                rows="2"
                bind:value={ReplyContent}
                placeholder="Введите ответ..."
            ></textarea>
            <button
                class="mt-2 bg-blue-500 text-white p-2 rounded"
                on:click={()=>addReply(ReplyContent, replyingToCommentId)}
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