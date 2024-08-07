export const fetchBoards = async () => {
    const response = await fetch('/api/boards');
    return await response.json();
};

export const fetchBoard = async (id) => {
    const response = await fetch(`/api/boards/${id}`);
    return await response.json();
};

export const fetchThreads = async (boardId) => {
    const response = await fetch(`/api/boards/${boardId}/threads`);
    return await response.json();
};

export const fetchThread = async (threadId) => {
    const response = await fetch(`/api/threads/${threadId}`);
    return await response.json();
};

export const fetchComments = async (threadId) => {
    const response = await fetch(`/api/threads/${threadId}/comments`);
    return await response.json();
};
