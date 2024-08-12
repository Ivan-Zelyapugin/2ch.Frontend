<script>
    // @ts-nocheck
    import {onMount} from 'svelte';
    import { page } from '$app/stores'; 

    import ThreadContent from '../../../../CommentComponents/ThreadContent.svelte';
    import CommentForm from '../../../../CommentComponents/CommentForm.svelte';
    import Comment from '..//..//../../CommentComponents/Comment.svelte';

    let name = "2ch app";
    let API_URL = "http://localhost:8080/";
    const baseUrl = 'http://localhost:9000';
  
    let comments = [];
    let newReplyContent = '';
    let replyingToCommentId = null;
  
    let thread;
    let threadId;
  
    $: threadId = $page.url.pathname.split('/')[4];
  
    async function getThread() {
        try {
            const response = await fetch(`${API_URL}api/Threads/${threadId}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                thread = data;
            } else {
                console.error("Ошибка получения треда:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Ошибка соединения:", error);
        }
    }
  
    function isImage(filePath) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        return imageExtensions.some(ext => filePath.endsWith(ext));
    }
  
    function getFileUrl(filePath) {
        const normalizedPath = filePath.replace(/^\/+/, ''); // Удаляем начальные слэши
        return `${baseUrl}/${normalizedPath}`;
    }
  
    async function initializeUser() {
        try {
            const response = await fetch(`${API_URL}api/AnonymousUser`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                // Обработайте данные, если нужно
            } else {
                console.error("Ошибка инициализации пользователя:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Ошибка соединения:", error);
        }
    }
  
    async function refreshComments() {
        try {
            const response = await fetch(`${API_URL}api/Comments?threadId=${threadId}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                comments = data;
            } else {
                console.error("Ошибка получения комментариев:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Ошибка соединения:", error);
        }
    }
  
    async function addComment(CommentContent, CommentFile) {
        try {
            const formData = new FormData();
            formData.append('content', CommentContent);
            if (CommentFile) {
                formData.append('file', CommentFile);
            }
  
            const response = await fetch(`${API_URL}api/Comments?id=${threadId}`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
  
            if (response.ok) {
                refreshComments();
                CommentContent = '';
                CommentFile = null;
            } else {
                console.error("Ошибка при добавлении комментария:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Ошибка соединения:", error);
        }
    }
  
  
    async function addReply(ReplyContent, replyingToCommentId) {
        if (!replyingToCommentId) return;
  
        try {
            const formData = new FormData();
            formData.append('content', ReplyContent);
            formData.append('parentCommentId', replyingToCommentId);
  
            const response = await fetch(`${API_URL}api/Comments?id=${threadId}`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
  
            if (response.ok) {
                refreshComments();
                ReplyContent = '';
                replyingToCommentId = null;
            } else {
                console.error("Ошибка при добавлении ответа:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Ошибка соединения:", error);
        }
    }
  
    async function deleteComment(id) {
        try {
            const response = await fetch(`${API_URL}api/Comments/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                refreshComments();
            } else {
                console.error("Ошибка при удалении :", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Ошибка соединения:", error);
        }
    }
  
    onMount(() => {
        initializeUser().then(() => {
            refreshComments();
            getThread();
        });
    });
  
    function findReplies(parentId) {
        return comments.filter(comment => comment.parentCommentId === parentId);
    }
  </script>
  
  
  <main class="container mx-auto p-4 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-4">
        <a href="/" class="text-blue-500 underline">2ch app</a>
    </h1>
    
    {#if thread}
    <ThreadContent {thread} {isImage} {getFileUrl} />
    
        <!-- Секция для отображения комментариев -->
        <section class="comments">
          {#if comments.length > 0}
              {#each comments.filter(comment => !comment.parentCommentId) as comment (comment.commentId)}
              <Comment {comment} {deleteComment} {isImage} {getFileUrl} {findReplies} {addReply}/>
              {/each}
          {:else}
              <p class="text-gray-500">Комментариев пока нет.</p>
          {/if}
        </section>
    
        <!-- Форма для добавления комментария -->
        <CommentForm {addComment} />
    {:else}
        <p>Загрузка треда...</p>
    {/if}
    </main>
  