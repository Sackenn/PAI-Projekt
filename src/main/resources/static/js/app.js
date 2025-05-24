// DOM Elements
const homeLink = document.getElementById('home-link');
const boardsLink = document.getElementById('boards-link');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const logoutLink = document.getElementById('logout-link');
const getStartedBtn = document.getElementById('get-started-btn');
const createBoardBtn = document.getElementById('create-board-btn');
const addListBtn = document.getElementById('add-list-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const usernameForm = document.getElementById('username-form');
const emailForm = document.getElementById('email-form');
const passwordForm = document.getElementById('password-form');
const userProfileSection = document.getElementById('user-profile-section');
const profileMessage = document.getElementById('profile-message');

// Board Management Elements
const boardSelect = document.getElementById('board-select');
const userSelect = document.getElementById('user-select');
const addMemberBtn = document.getElementById('add-member-btn');
const boardMembersList = document.getElementById('board-members-list');

// Card Detail Modal Elements
const cardDetailModal = document.getElementById('card-detail-modal');
const closeModalBtn = document.querySelector('.close-modal');
const cardDetailTitle = document.getElementById('card-detail-title');
const cardTitleInput = document.getElementById('card-title-input');
const cardDescriptionInput = document.getElementById('card-description-input');
const cardCreationDate = document.getElementById('card-creation-date');
const cardStartDate = document.getElementById('card-start-date');
const cardDueDate = document.getElementById('card-due-date');
const saveDatesBtn = document.getElementById('save-dates-btn');
const labelsContainer = document.getElementById('labels-container');
const globalLabelsContainer = document.getElementById('global-labels-container');
const labelNameInput = document.getElementById('label-name-input');
const labelColorInput = document.getElementById('label-color-input');
const globalLabelCheckbox = document.getElementById('global-label-checkbox');
const addLabelBtn = document.getElementById('add-label-btn');
const tasksContainer = document.getElementById('tasks-container');
const taskDescriptionInput = document.getElementById('task-description-input');
const addTaskBtn = document.getElementById('add-task-btn');
const saveCardBtn = document.getElementById('save-card-btn');
const deleteCardBtn = document.getElementById('delete-card-btn');

// Global variables
let currentBoardId = null;
let currentCardId = null;
let currentListId = null;

// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Helper function to get userId from localStorage or cookie
function getUserId() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        return null;
    }
    return userId;
}

// Helper function to get userId as number
function getUserIdAsNumber() {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
        return null;
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
        return null;
    }

    return userId;
}

// Function to update UI based on login state
function updateUIForLoginState() {
    // Check both localStorage and cookie for userId
    const userIdFromStorage = localStorage.getItem('userId');
    const userIdFromCookie = getCookie('userId');

    // User is logged in if either userId source is available
    if (userIdFromStorage || userIdFromCookie) {
        // If we have a cookie but not localStorage, update localStorage
        if (userIdFromCookie && !userIdFromStorage) {
            localStorage.setItem('userId', userIdFromCookie);
        }

        // User is logged in
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'inline-block';
        boardsLink.style.display = 'inline-block';

        // Show user profile section on home page
        userProfileSection.style.display = 'block';

        // Load user profile data
        fetchUserProfile();
    } else {
        // User is logged out
        loginLink.style.display = 'inline-block';
        registerLink.style.display = 'inline-block';
        logoutLink.style.display = 'none';
        boardsLink.style.display = 'none';

        // Hide user profile section
        userProfileSection.style.display = 'none';
    }
}

// Sections
const homeSection = document.getElementById('home-section');
const boardsSection = document.getElementById('boards-section');
const boardDetailSection = document.getElementById('board-detail-section');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');

// API Base URL
const API_URL = '/api';

// Helper Functions
function showSection(section) {
    // Hide all sections
    homeSection.classList.remove('active-section');
    homeSection.classList.add('hidden-section');
    boardsSection.classList.remove('active-section');
    boardsSection.classList.add('hidden-section');
    boardDetailSection.classList.remove('active-section');
    boardDetailSection.classList.add('hidden-section');
    loginSection.classList.remove('active-section');
    loginSection.classList.add('hidden-section');
    registerSection.classList.remove('active-section');
    registerSection.classList.add('hidden-section');

    // Show the selected section
    section.classList.remove('hidden-section');
    section.classList.add('active-section');
}

// API Functions
async function fetchBoards() {
    try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return [];
        }

        const response = await fetch(`${API_URL}/boards/user/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch boards');
        }
        const boards = await response.json();
        return boards;
    } catch (error) {
        console.error('Error fetching boards:', error);
        return [];
    }
}

async function fetchAllUsers() {
    try {
        const response = await fetch(`${API_URL}/user/all`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

async function fetchBoardDetails(boardId) {
    try {
        const userId = getUserIdAsNumber();
        if (!userId) {
            console.error('User ID not found or invalid');
            return null;
        }

        const url = `${API_URL}/boards/${boardId}/user/${userId}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch board details. Server response:', errorText);
            throw new Error(`Failed to fetch board details: ${response.status} ${errorText}`);
        }

        const board = await response.json();
        return board;
    } catch (error) {
        console.error('Error fetching board details:', error);
        return null;
    }
}

async function fetchBoardLists(boardId) {
    try {
        const userId = getUserIdAsNumber();
        if (!userId) {
            console.error('User ID not found or invalid');
            return [];
        }

        const url = `${API_URL}/boards/${boardId}/lists?userId=${userId}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch board lists. Server response:', errorText);
            throw new Error(`Failed to fetch board lists: ${response.status} ${errorText}`);
        }

        const lists = await response.json();
        return lists;
    } catch (error) {
        console.error('Error fetching board lists:', error);
        return [];
    }
}

async function fetchCards(boardId, listId) {
    try {
        const userId = getUserIdAsNumber();
        if (!userId) {
            console.error('User ID not found or invalid');
            return [];
        }

        const url = `${API_URL}/boards/${boardId}/lists/${listId}/cards?userId=${userId}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch cards. Server response:', errorText);
            throw new Error(`Failed to fetch cards: ${response.status} ${errorText}`);
        }

        const cards = await response.json();
        return cards;
    } catch (error) {
        console.error('Error fetching cards:', error);
        return [];
    }
}

async function fetchCardDetails(boardId, listId, cardId) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return null;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch card details');
        }
        const card = await response.json();
        return card;
    } catch (error) {
        console.error('Error fetching card details:', error);
        return null;
    }
}

async function fetchCardTasks(boardId, listId, cardId) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return [];
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/tasks?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch card tasks');
        }
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching card tasks:', error);
        return [];
    }
}

async function createBoard(boardData) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return null;
        }

        const response = await fetch(`${API_URL}/boards/user/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boardData)
        });
        if (!response.ok) {
            throw new Error('Failed to create board');
        }
        const board = await response.json();
        return board;
    } catch (error) {
        console.error('Error creating board:', error);
        return null;
    }
}

async function createList(boardId, listData) {
    try {
        const userId = getUserIdAsNumber();
        if (!userId) {
            console.error('User ID not found or invalid');
            return null;
        }

        const url = `${API_URL}/boards/${boardId}/lists?userId=${userId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to create list. Server response:', errorText);
            throw new Error(`Failed to create list: ${response.status} ${errorText}`);
        }

        const list = await response.json();
        return list;
    } catch (error) {
        console.error('Error creating list:', error);
        return null;
    }
}

async function createCard(boardId, listId, cardData) {
    try {
        const userId = getUserIdAsNumber();
        if (!userId) {
            console.error('User ID not found or invalid');
            return null;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });
        if (!response.ok) {
            throw new Error('Failed to create card');
        }
        const card = await response.json();
        return card;
    } catch (error) {
        console.error('Error creating card:', error);
        return null;
    }
}

async function updateCard(boardId, listId, cardId, cardData) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return null;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });
        if (!response.ok) {
            throw new Error('Failed to update card');
        }
        const card = await response.json();
        return card;
    } catch (error) {
        console.error('Error updating card:', error);
        return null;
    }
}

async function deleteCard(boardId, listId, cardId) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return false;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}?userId=${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete card');
        }
        return true;
    } catch (error) {
        console.error('Error deleting card:', error);
        return false;
    }
}

async function updateCardDates(boardId, listId, cardId, dateData) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return null;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/dates?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dateData)
        });
        if (!response.ok) {
            throw new Error('Failed to update card dates');
        }
        const card = await response.json();
        return card;
    } catch (error) {
        console.error('Error updating card dates:', error);
        return null;
    }
}

async function addLabelToCard(boardId, listId, cardId, labelData) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return false;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/labels?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(labelData)
        });
        if (!response.ok) {
            throw new Error('Failed to add label to card');
        }
        return true;
    } catch (error) {
        console.error('Error adding label to card:', error);
        return false;
    }
}

async function addGlobalLabelToCard(boardId, listId, cardId, labelId) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return false;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/global-labels/${labelId}?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to add global label to card');
        }
        return true;
    } catch (error) {
        console.error('Error adding global label to card:', error);
        return false;
    }
}

async function fetchGlobalLabels() {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return [];
        }

        const response = await fetch(`${API_URL}/labels/global?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch global labels');
        }
        const labels = await response.json();
        return labels;
    } catch (error) {
        console.error('Error fetching global labels:', error);
        return [];
    }
}

async function createGlobalLabel(labelData) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return null;
        }

        const response = await fetch(`${API_URL}/labels/global?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(labelData)
        });
        if (!response.ok) {
            throw new Error('Failed to create global label');
        }
        const label = await response.json();
        return label;
    } catch (error) {
        console.error('Error creating global label:', error);
        return null;
    }
}

async function deleteGlobalLabel(labelId) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return false;
        }

        const response = await fetch(`${API_URL}/labels/global/${labelId}?userId=${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete global label');
        }
        return true;
    } catch (error) {
        console.error('Error deleting global label:', error);
        return false;
    }
}

async function removeLabelFromCard(boardId, listId, cardId, labelId) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return false;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/labels/${labelId}?userId=${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to remove label from card');
        }
        return true;
    } catch (error) {
        console.error('Error removing label from card:', error);
        return false;
    }
}

async function createTask(boardId, listId, cardId, taskData) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return null;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/tasks?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        const task = await response.json();
        return task;
    } catch (error) {
        console.error('Error creating task:', error);
        return null;
    }
}

async function updateTask(boardId, listId, cardId, taskId, taskData) {
    try {
        const userId = getUserId();
        if (!userId) {
            console.error('User ID not found');
            return null;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/tasks/${taskId}?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        const task = await response.json();
        return task;
    } catch (error) {
        console.error('Error updating task:', error);
        return null;
    }
}

async function deleteTask(boardId, listId, cardId, taskId) {
    try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return false;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/tasks/${taskId}?userId=${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        return false;
    }
}

// Fetch user profile data
async function fetchUserProfile() {
    try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return null;
        }

        const response = await fetch(`${API_URL}/user/profile/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        console.log('User profile fetched successfully:', userData);

        // Populate the profile form
        document.getElementById('profile-username').value = userData.username;
        document.getElementById('profile-email').value = userData.email;
        // Password field is left empty for security reasons

        return userData;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

// Update username
async function updateUsername(username) {
    try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return false;
        }

        const response = await fetch(`${API_URL}/user/profile/${userId}/username`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update username');
        }

        const responseData = await response.json();
        console.log('Username updated successfully:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error updating username:', error);
        throw error;
    }
}

// Update email
async function updateEmail(email) {
    try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return false;
        }

        const response = await fetch(`${API_URL}/user/profile/${userId}/email`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update email');
        }

        const responseData = await response.json();
        console.log('Email updated successfully:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error updating email:', error);
        throw error;
    }
}

// Update password
async function updatePassword(currentPassword, password) {
    try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return false;
        }

        const response = await fetch(`${API_URL}/user/profile/${userId}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update password');
        }

        const responseData = await response.json();
        console.log('Password updated successfully:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
}


async function deleteBoard(boardId) {
    try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return false;
        }

        const confirmed = confirm('Are you sure you want to delete this board? This action cannot be undone.');
        if (!confirmed) return false;

        const response = await fetch(`${API_URL}/boards/${boardId}/user/${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete board');
        }

        // Reload boards to update the UI
        loadBoards();
        return true;
    } catch (error) {
        console.error('Error deleting board:', error);
        alert('Failed to delete board. Please try again.');
        return false;
    }
}

async function deleteList(boardId, listId) {
    try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            alert('You must be logged in to delete a list.');
            return false;
        }

        const confirmed = confirm('Are you sure you want to delete this list? This action cannot be undone.');
        if (!confirmed) return false;

        const response = await fetch(`${API_URL}/boards/${boardId}/lists/${listId}?userId=${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete list');
        }

        // Reload board details to update the UI
        loadBoardDetails(boardId);
        return true;
    } catch (error) {
        console.error('Error deleting list:', error);
        alert('Failed to delete list. Please try again.');
        return false;
    }
}

// UI Functions
async function loadBoards() {
    const boardsContainer = document.getElementById('boards-container');
    boardsContainer.innerHTML = '';

    const boards = await fetchBoards();

    if (boards.length === 0) {
        boardsContainer.innerHTML = '<p>No boards found. Create a new board to get started.</p>';
        return;
    }

    // Get the current user ID
    const currentUserId = parseInt(localStorage.getItem('userId'), 10);

    boards.forEach(board => {
        const boardCard = document.createElement('div');
        boardCard.className = 'board-card';

        // Check if the current user is the owner of the board
        const isOwner = board.owner && board.owner.id === currentUserId;

        // Only show the delete button if the user is the owner
        const deleteButton = isOwner ? 
            `<button class="delete-board-btn danger-btn" data-board-id="${board.id}">Delete</button>` : '';

        boardCard.innerHTML = `
            <h3>${board.name}</h3>
            <div class="board-card-actions">
                <button class="view-board-btn" data-board-id="${board.id}">View Board</button>
                ${deleteButton}
            </div>
        `;
        boardsContainer.appendChild(boardCard);
    });

    // Add event listeners to view board buttons
    document.querySelectorAll('.view-board-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const boardId = e.target.getAttribute('data-board-id');
            loadBoardDetails(parseInt(boardId, 10));
        });
    });

    // Add event listeners to delete board buttons
    document.querySelectorAll('.delete-board-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const boardId = e.target.getAttribute('data-board-id');
            deleteBoard(parseInt(boardId, 10));
        });
    });

    // Load board select dropdown
    await loadBoardSelect(boards);

    // Load user select dropdown
    await loadUserSelect();
}

async function loadBoardSelect(boards) {
    if (!boardSelect) return;

    // Clear previous options
    boardSelect.innerHTML = '<option value="">Wybierz tablicę...</option>';

    // Add options for each board
    boards.forEach(board => {
        const option = document.createElement('option');
        option.value = board.id;
        option.textContent = board.name;
        boardSelect.appendChild(option);
    });

    // Add event listener to board select
    boardSelect.addEventListener('change', async () => {
        const selectedBoardId = boardSelect.value;

        if (selectedBoardId) {
            const parsedBoardId = parseInt(selectedBoardId, 10);
            await loadBoardMembers(parsedBoardId);
        } else {
            boardMembersList.innerHTML = '';
        }
    });
}

async function loadUserSelect() {
    if (!userSelect) return;

    // Clear previous options
    userSelect.innerHTML = '<option value="">Wybierz użytkownika...</option>';

    // Fetch all users
    const users = await fetchAllUsers();

    // Add options for each user
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.username;
        userSelect.appendChild(option);
    });
}

async function loadBoardMembers(boardId) {
    if (!boardMembersList) return;

    // Clear previous members
    boardMembersList.innerHTML = '';

    // Fetch board details
    const board = await fetchBoardDetails(boardId);
    if (!board) return;

    // Get current user ID
    const currentUserId = parseInt(localStorage.getItem('userId'), 10);

    // Check if board.owner exists before accessing its properties
    if (!board.owner) {
        console.error('Board owner is undefined');
        return;
    }

    // Check if current user is the owner
    const isOwner = board.owner.id === currentUserId;

    // Add owner to the list
    const ownerItem = document.createElement('div');
    ownerItem.className = 'member-item';
    ownerItem.innerHTML = `
        <div class="member-info">
            ${board.owner.username} <span class="owner-badge">Owner</span>
        </div>
    `;
    boardMembersList.appendChild(ownerItem);

    // Add members to the list
    if (board.members && board.members.length > 0) {
        board.members.forEach(member => {
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';

            let actionsHtml = '';
            if (isOwner) {
                actionsHtml = `
                    <div class="member-actions">
                        <button class="make-owner-btn" data-member-id="${member.id}">Make Owner</button>
                        <button class="remove-member-btn" data-member-id="${member.id}">Remove</button>
                    </div>
                `;
            }

            memberItem.innerHTML = `
                <div class="member-info">${member.username}</div>
                ${actionsHtml}
            `;
            boardMembersList.appendChild(memberItem);
        });

        // Add event listeners to make owner buttons
        document.querySelectorAll('.make-owner-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const memberId = e.target.getAttribute('data-member-id');
                await makeOwner(boardId, parseInt(memberId, 10));
            });
        });

        // Add event listeners to remove member buttons
        document.querySelectorAll('.remove-member-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const memberId = e.target.getAttribute('data-member-id');
                await removeMemberFromBoard(boardId, parseInt(memberId, 10));
            });
        });
    }

    // Add event listener to add member button
    if (isOwner && addMemberBtn) {
        addMemberBtn.onclick = async () => {
            const selectedUserId = userSelect.value;

            if (selectedUserId) {
                const parsedUserId = parseInt(selectedUserId, 10);
                await addMemberToBoard(boardId, parsedUserId);
            }
        };
    }
}

async function addMemberToBoard(boardId, userId) {
    try {
        const currentUserId = getUserIdAsNumber();
        if (!currentUserId) {
            console.error('User ID not found or invalid');
            return;
        }

        const response = await fetch(`${API_URL}/boards/${boardId}/owner/${currentUserId}/members/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to add member to board');
        }

        // Reload board members
        await loadBoardMembers(boardId);

        // Reset user select
        userSelect.value = '';

    } catch (error) {
        console.error('Error adding member to board:', error);
        alert('Failed to add member to board. Please try again.');
    }
}

async function removeMemberFromBoard(boardId, userId) {
    try {
        const currentUserId = parseInt(localStorage.getItem('userId'), 10);

        const response = await fetch(`${API_URL}/boards/${boardId}/owner/${currentUserId}/members/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to remove member from board');
        }

        // Reload board members
        await loadBoardMembers(boardId);

    } catch (error) {
        console.error('Error removing member from board:', error);
        alert('Failed to remove member from board. Please try again.');
    }
}

async function makeOwner(boardId, newOwnerId) {
    try {
        const currentUserId = parseInt(localStorage.getItem('userId'), 10);

        const response = await fetch(`${API_URL}/boards/${boardId}/owner/${currentUserId}/change-owner/${newOwnerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to change board owner');
        }

        // Reload board members
        await loadBoardMembers(boardId);

        // Reload boards to update the UI
        await loadBoards();

    } catch (error) {
        console.error('Error changing board owner:', error);
        alert('Failed to change board owner. Please try again.');
    }
}

async function loadBoardDetails(boardId) {
    // Ensure boardId is an integer
    boardId = parseInt(boardId, 10);

    const board = await fetchBoardDetails(boardId);

    if (!board) {
        console.error('Board details not found');
        return;
    }

    // Set the current board ID
    currentBoardId = boardId;

    document.getElementById('board-title').textContent = board.name;

    const listsContainer = document.getElementById('lists-container');
    listsContainer.innerHTML = '';
    const lists = await fetchBoardLists(boardId);

    for (const list of lists) {
        const listColumn = document.createElement('div');
        listColumn.className = 'list-column';
        listColumn.innerHTML = `
            <div class="list-header">
                <h3>${list.name}</h3>
                <div class="list-header-actions">
                    <button class="edit-list-btn" data-list-id="${list.id}">Edit</button>
                    <button class="delete-list-btn danger-btn" data-list-id="${list.id}">Delete</button>
                </div>
            </div>
            <div class="cards-container" id="cards-container-${list.id}"></div>
            <button class="add-card-btn" data-list-id="${list.id}">+ Add Card</button>
        `;
        listsContainer.appendChild(listColumn);

        // Load cards for this list
        const cards = await fetchCards(boardId, list.id);
        const cardsContainer = document.getElementById(`cards-container-${list.id}`);

        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.setAttribute('data-card-id', card.id);

            // Create labels display
            let labelsHtml = '';
            if (card.labels && card.labels.length > 0) {
                labelsHtml = '<div class="card-labels">';
                card.labels.forEach(label => {
                    labelsHtml += `<div class="card-label" style="background-color: ${label.color}" title="${label.name}"></div>`;
                });
                labelsHtml += '</div>';
            }

            // Format dates if available
            let datesHtml = '';
            if (card.dueDate) {
                const dueDate = new Date(card.dueDate);
                datesHtml = `<div class="card-dates">Due: ${dueDate.toLocaleDateString()}</div>`;
            }

            // Show task count if available
            let tasksHtml = '';
            if (card.tasks && card.tasks.length > 0) {
                const completedTasks = card.tasks.filter(task => task.completed).length;
                tasksHtml = `<div class="card-tasks">${completedTasks}/${card.tasks.length} tasks</div>`;
            }

            cardElement.innerHTML = `
                ${labelsHtml}
                <h4>${card.title}</h4>
                <p>${card.description || ''}</p>
                ${datesHtml}
                ${tasksHtml}
            `;

            // Add click event to open card details
            cardElement.addEventListener('click', () => {
                openCardDetailModal(card.id, list.id);
            });

            cardsContainer.appendChild(cardElement);
        });
    }

    // Add event listeners to edit list buttons
    document.querySelectorAll('.edit-list-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const listId = e.target.getAttribute('data-list-id');
            editList(parseInt(listId, 10));
        });
    });

    // Add event listeners to delete list buttons
    document.querySelectorAll('.delete-list-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const listId = e.target.getAttribute('data-list-id');
            deleteList(currentBoardId, parseInt(listId, 10));
        });
    });

    // Add event listeners to add card buttons
    document.querySelectorAll('.add-card-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const listId = e.target.getAttribute('data-list-id');
            addCard(parseInt(listId, 10));
        });
    });

    // Show board detail section
    showSection(boardDetailSection);
}

// Event Listeners
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(homeSection);
});

boardsLink.addEventListener('click', (e) => {
    e.preventDefault();
    loadBoards();
    showSection(boardsSection);
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(loginSection);
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(registerSection);
});

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

getStartedBtn.addEventListener('click', () => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (userId) {
        // User is logged in, show boards
        showSection(boardsSection);
        loadBoards();
    } else {
        // User is not logged in, redirect to login page
        showSection(loginSection);
        alert('Please log in to view your boards.');
    }
});

createBoardBtn.addEventListener('click', () => {
    const boardName = prompt('Enter board name:');
    if (boardName) {
        createBoard({ name: boardName })
            .then(board => {
                if (board) {
                    loadBoards();
                }
            });
    }
});

addListBtn.addEventListener('click', () => {
    if (!currentBoardId) {
        alert('No board selected. Please select a board first.');
        return;
    }

    // Log userId for debugging
    const userId = localStorage.getItem('userId');
    console.log('addListBtn click - userId from localStorage:', userId);

    const listName = prompt('Enter list name:');
    if (listName) {
        createList(currentBoardId, { name: listName })
            .then(list => {
                if (list) {
                    loadBoardDetails(currentBoardId);
                }
            });
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Important: This tells fetch to include cookies in the request
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store user ID in localStorage for later use
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.username);

        // Log userId for debugging
        console.log('Login successful - userId stored in localStorage:', data.id);

        // Check if the cookie was set
        setTimeout(() => {
            const userIdFromCookie = getCookie('userId');
            console.log('After login - userId from cookie:', userIdFromCookie);
        }, 100); // Small delay to ensure cookie is set

        // Update UI based on login state
        updateUIForLoginState();

        alert(`Login successful for ${data.username}`);
        showSection(boardsSection);
        loadBoards();
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please check your username and password.');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        alert(`Registration successful for ${username}`);
        showSection(loginSection);
    } catch (error) {
        console.error('Error during registration:', error);
        alert(`Registration failed: ${error.message}`);
    }
});

// Username form submission
usernameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('profile-username').value;

    try {
        // Update username
        const result = await updateUsername(username);

        // Show success message
        profileMessage.textContent = 'Nazwa użytkownika zaktualizowana pomyślnie!';
        profileMessage.style.color = 'green';

        // Refresh user data in localStorage if username changed
        if (username !== localStorage.getItem('username')) {
            localStorage.setItem('username', username);
        }
    } catch (error) {
        console.error('Error updating username:', error);

        // Show error message
        profileMessage.textContent = `Błąd: ${error.message}`;
        profileMessage.style.color = 'red';
    }
});

// Email form submission
emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('profile-email').value;

    try {
        // Update email
        const result = await updateEmail(email);

        // Show success message
        profileMessage.textContent = 'Email zaktualizowany pomyślnie!';
        profileMessage.style.color = 'green';
    } catch (error) {
        console.error('Error updating email:', error);

        // Show error message
        profileMessage.textContent = `Błąd: ${error.message}`;
        profileMessage.style.color = 'red';
    }
});

// Password form submission
passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('profile-current-password').value;
    const password = document.getElementById('profile-password').value;

    try {
        // Update password
        const result = await updatePassword(currentPassword, password);

        // Show success message
        profileMessage.textContent = 'Hasło zaktualizowane pomyślnie!';
        profileMessage.style.color = 'green';

        // Clear password fields
        document.getElementById('profile-current-password').value = '';
        document.getElementById('profile-password').value = '';
    } catch (error) {
        console.error('Error updating password:', error);

        // Show error message
        profileMessage.textContent = `Błąd: ${error.message}`;
        profileMessage.style.color = 'red';
    }
});

// Logout function
async function logout() {
    try {
        // Call the logout endpoint to clear the cookie
        const response = await fetch(`${API_URL}/auth/signout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Important: This tells fetch to include cookies in the request
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        // Clear localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('username');

        // Reset current board ID
        currentBoardId = null;

        // Check if the cookie was cleared
        setTimeout(() => {
            const userIdFromCookie = getCookie('userId');
            console.log('After logout - userId from cookie:', userIdFromCookie);
        }, 100); // Small delay to ensure cookie is processed

        // Update UI for logout state
        updateUIForLoginState();

        // Show home section
        showSection(homeSection);

        console.log('Logout successful');
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Logout failed. Please try again.');
    }
}

// Function to edit a list
function editList(listId) {
    if (!currentBoardId) {
        alert('No board selected. Please select a board first.');
        return;
    }

    // Get the user ID from localStorage
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
        console.error('User ID not found in localStorage');
        alert('You must be logged in to edit a list.');
        return;
    }

    // Parse userId as integer
    const userId = parseInt(userIdStr, 10);
    console.log('editList - userId after parseInt:', userId, 'type:', typeof userId);

    const listName = prompt('Enter new list name:');
    if (listName) {
        fetch(`${API_URL}/boards/${currentBoardId}/lists/${listId}?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: listName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update list');
            }
            return response.json();
        })
        .then(updatedList => {
            // Reload board details to show the updated list
            loadBoardDetails(currentBoardId);
        })
        .catch(error => {
            console.error('Error updating list:', error);
            alert('Failed to update list. Please try again.');
        });
    }
}

// Function to add a card to a list
function addCard(listId) {
    if (!currentBoardId) {
        alert('No board selected. Please select a board first.');
        return;
    }

    const cardTitle = prompt('Enter card title:');
    if (cardTitle) {
        const cardData = {
            title: cardTitle,
            description: ''
        };

        createCard(currentBoardId, listId, cardData)
            .then(card => {
                if (card) {
                    // Reload board details to show the new card
                    loadBoardDetails(currentBoardId);
                }
            });
    }
}

// Function to open card detail modal
async function openCardDetailModal(cardId, listId) {
    // Set current card and list IDs
    currentCardId = cardId;
    currentListId = listId;

    // Fetch card details
    const card = await fetchCardDetails(currentBoardId, listId, cardId);
    if (!card) {
        alert('Failed to load card details. Please try again.');
        return;
    }

    // Fetch card tasks
    const tasks = await fetchCardTasks(currentBoardId, listId, cardId);

    // Update modal title and inputs
    cardDetailTitle.textContent = card.title;
    cardTitleInput.value = card.title;
    cardDescriptionInput.value = card.description || '';

    // Update dates
    if (card.creationDate) {
        const creationDate = new Date(card.creationDate);
        cardCreationDate.textContent = creationDate.toLocaleString();
    } else {
        cardCreationDate.textContent = 'Not available';
    }

    if (card.startDate) {
        cardStartDate.value = formatDateForInput(card.startDate);
    } else {
        cardStartDate.value = '';
    }

    if (card.dueDate) {
        cardDueDate.value = formatDateForInput(card.dueDate);
    } else {
        cardDueDate.value = '';
    }

    // Display labels
    displayLabels(card.labels || []);

    // Display global labels
    displayGlobalLabels();

    // Display tasks
    displayTasks(tasks || []);

    // Show the modal
    showSection(cardDetailModal);
}

// Function to display labels in the modal
function displayLabels(labels) {
    labelsContainer.innerHTML = '';

    if (labels.length === 0) {
        labelsContainer.innerHTML = '<p>No labels yet</p>';
        return;
    }

    labels.forEach(label => {
        const labelElement = document.createElement('div');
        labelElement.className = 'label';
        labelElement.style.backgroundColor = label.color;
        labelElement.innerHTML = `
            ${label.name}
            <span class="label-delete" data-label-id="${label.id}">&times;</span>
        `;
        labelsContainer.appendChild(labelElement);

        // Add event listener to delete button
        const deleteBtn = labelElement.querySelector('.label-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            deleteLabel(label.id);
        });
    });
}

// Function to display global labels in the modal
async function displayGlobalLabels() {
    globalLabelsContainer.innerHTML = '';

    const globalLabels = await fetchGlobalLabels();

    if (globalLabels.length === 0) {
        globalLabelsContainer.innerHTML = '<p>No global labels yet</p>';
        return;
    }

    globalLabels.forEach(label => {
        const labelElement = document.createElement('div');
        labelElement.className = 'global-label';
        labelElement.style.backgroundColor = label.color;
        labelElement.setAttribute('data-label-id', label.id);
        labelElement.innerHTML = `
            ${label.name}
            <span class="global-label-add">+</span>
            <span class="global-label-delete">&times;</span>
        `;
        globalLabelsContainer.appendChild(labelElement);

        // Add event listener to add button
        const addBtn = labelElement.querySelector('.global-label-add');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            addGlobalLabelToCard(currentBoardId, currentListId, currentCardId, label.id)
                .then(success => {
                    if (success) {
                        // Refresh card details
                        openCardDetailModal(currentCardId, currentListId);
                    } else {
                        alert('Failed to add global label to card. Please try again.');
                    }
                });
        });

        // Add event listener to delete button
        const deleteBtn = labelElement.querySelector('.global-label-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            deleteGlobalLabelConfirm(label.id);
        });
    });
}

// Function to display tasks in the modal
function displayTasks(tasks) {
    tasksContainer.innerHTML = '';

    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p>No tasks yet</p>';
        return;
    }

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
            <span class="${task.completed ? 'task-completed' : ''}">${task.description}</span>
            <span class="task-delete" data-task-id="${task.id}">&times;</span>
        `;
        tasksContainer.appendChild(taskElement);

        // Add event listener to checkbox
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            toggleTaskCompletion(task.id, checkbox.checked);
        });

        // Add event listener to delete button
        const deleteBtn = taskElement.querySelector('.task-delete');
        deleteBtn.addEventListener('click', () => {
            deleteTaskItem(task.id);
        });
    });
}

// Function to delete a label
async function deleteLabel(labelId) {
    const confirmed = confirm('Are you sure you want to delete this label?');
    if (!confirmed) return;

    const success = await removeLabelFromCard(currentBoardId, currentListId, currentCardId, labelId);
    if (success) {
        // Refresh card details
        openCardDetailModal(currentCardId, currentListId);
    } else {
        alert('Failed to delete label. Please try again.');
    }
}

// Function to confirm and delete a global label
async function deleteGlobalLabelConfirm(labelId) {
    const confirmed = confirm('Are you sure you want to delete this global label? This will remove it from all cards that use it.');
    if (!confirmed) return;

    const success = await deleteGlobalLabel(labelId);
    if (success) {
        // Refresh global labels
        displayGlobalLabels();
        // Also refresh card details in case the card had this label
        if (currentCardId && currentListId) {
            openCardDetailModal(currentCardId, currentListId);
        }
    } else {
        alert('Failed to delete global label. Please try again.');
    }
}

// Function to toggle task completion
async function toggleTaskCompletion(taskId, completed) {
    const taskData = {
        completed: completed
    };

    const updatedTask = await updateTask(currentBoardId, currentListId, currentCardId, taskId, taskData);
    if (!updatedTask) {
        alert('Failed to update task. Please try again.');
    }
}

// Function to delete a task
async function deleteTaskItem(taskId) {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    const success = await deleteTask(currentBoardId, currentListId, currentCardId, taskId);
    if (success) {
        // Refresh card details
        openCardDetailModal(currentCardId, currentListId);
    } else {
        alert('Failed to delete task. Please try again.');
    }
}

// Helper function to format date for datetime-local input
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
}

// Helper function to close the modal
function closeCardDetailModal() {
    cardDetailModal.classList.remove('active-section');
    cardDetailModal.classList.add('hidden-section');

    // Reset current card and list IDs
    currentCardId = null;
    currentListId = null;
}

// Event listeners for modal actions
closeModalBtn.addEventListener('click', closeCardDetailModal);

// Save card changes
saveCardBtn.addEventListener('click', async () => {
    const cardData = {
        title: cardTitleInput.value,
        description: cardDescriptionInput.value
    };

    const updatedCard = await updateCard(currentBoardId, currentListId, currentCardId, cardData);
    if (updatedCard) {
        // Reload board details to show the updated card
        loadBoardDetails(currentBoardId);
        closeCardDetailModal();
    } else {
        alert('Failed to update card. Please try again.');
    }
});

// Save card dates
saveDatesBtn.addEventListener('click', async () => {
    const dateData = {};

    if (cardStartDate.value) {
        dateData.startDate = new Date(cardStartDate.value).toISOString();
    }

    if (cardDueDate.value) {
        dateData.dueDate = new Date(cardDueDate.value).toISOString();
    }

    const updatedCard = await updateCardDates(currentBoardId, currentListId, currentCardId, dateData);
    if (updatedCard) {
        alert('Dates updated successfully!');
        // Refresh card details
        openCardDetailModal(currentCardId, currentListId);
    } else {
        alert('Failed to update dates. Please try again.');
    }
});

// Add label to card
addLabelBtn.addEventListener('click', async () => {
    const labelName = labelNameInput.value.trim();
    const labelColor = labelColorInput.value;
    const isGlobal = globalLabelCheckbox.checked;

    if (!labelName) {
        alert('Please enter a label name.');
        return;
    }

    const labelData = {
        name: labelName,
        color: labelColor
    };

    let success = false;

    if (isGlobal) {
        // Create a global label
        const globalLabel = await createGlobalLabel(labelData);
        if (globalLabel) {
            // Add the global label to the card
            success = await addGlobalLabelToCard(currentBoardId, currentListId, currentCardId, globalLabel.id);
        }
    } else {
        // Create a card-specific label
        success = await addLabelToCard(currentBoardId, currentListId, currentCardId, labelData);
    }

    if (success) {
        // Clear inputs
        labelNameInput.value = '';
        globalLabelCheckbox.checked = false;

        // Refresh card details
        openCardDetailModal(currentCardId, currentListId);
    } else {
        alert('Failed to add label. Please try again.');
    }
});

// Add task to card
addTaskBtn.addEventListener('click', async () => {
    const taskDescription = taskDescriptionInput.value.trim();

    if (!taskDescription) {
        alert('Please enter a task description.');
        return;
    }

    const taskData = {
        description: taskDescription
    };

    const newTask = await createTask(currentBoardId, currentListId, currentCardId, taskData);
    if (newTask) {
        // Clear input
        taskDescriptionInput.value = '';

        // Refresh card details
        openCardDetailModal(currentCardId, currentListId);
    } else {
        alert('Failed to add task. Please try again.');
    }
});

// Delete card
deleteCardBtn.addEventListener('click', async () => {
    const confirmed = confirm('Are you sure you want to delete this card? This action cannot be undone.');
    if (!confirmed) return;

    const success = await deleteCard(currentBoardId, currentListId, currentCardId);
    if (success) {
        // Reload board details to show the updated list
        loadBoardDetails(currentBoardId);
        closeCardDetailModal();
    } else {
        alert('Failed to delete card. Please try again.');
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Clear localStorage on page load to ensure a clean state
    // Uncomment the following lines if you want to force logout on page refresh
    // localStorage.removeItem('userId');
    // localStorage.removeItem('username');

    // Check both localStorage and cookie for userId
    const userIdFromStorage = localStorage.getItem('userId');
    const userIdFromCookie = getCookie('userId');

    console.log('userId in localStorage:', userIdFromStorage);
    console.log('userId in cookie:', userIdFromCookie);

    // If we have a cookie but not localStorage, update localStorage
    if (userIdFromCookie && !userIdFromStorage) {
        localStorage.setItem('userId', userIdFromCookie);
        console.log('Updated localStorage with userId from cookie:', userIdFromCookie);
    }

    // Log the final userId state
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.log('userId is not set after initialization');
    } else {
        console.log('userId is set after initialization:', userId);
        console.log('userId type:', typeof userId);
    }

    // Update UI based on login state
    updateUIForLoginState();

    showSection(homeSection);
});
