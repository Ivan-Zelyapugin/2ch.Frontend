<script>
    export let thread;
    export let isImage;
    export let getFileUrl;
</script>

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