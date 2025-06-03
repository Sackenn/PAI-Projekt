import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBoards, createBoard, deleteBoard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BoardMembers from '../components/BoardMembers';

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [activeTab, setActiveTab] = useState('boards'); // 'boards' or 'members'

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    loadBoards();
  }, [currentUser, navigate]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await fetchBoards();
      setBoards(data);
      setError('');
    } catch (err) {
      console.error('Error loading boards:', err);
      setError('Failed to load boards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!newBoardName.trim()) {
      setError('Board name cannot be empty');
      return;
    }

    try {
      const newBoard = await createBoard({ name: newBoardName });
      setBoards([...boards, newBoard]);
      setNewBoardName('');
      setShowCreateForm(false);
      setError('');
    } catch (err) {
      console.error('Error creating board:', err);
      setError('Failed to create board. Please try again.');
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Czy na pewno chcesz usunac ta tablice? Nie bedzie mozna tego cofnac.')) {
      return;
    }

    try {
      await deleteBoard(boardId);
      setBoards(boards.filter(board => board.id !== boardId));
    } catch (err) {
      console.error('Error deleting board:', err);
      setError('Failed to delete board. Please try again.');
    }
  };

  const handleViewBoard = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  if (loading) {
    return <div className="section">Loading...</div>;
  }

  const handleSelectBoard = (boardId) => {
    setSelectedBoardId(boardId);
    setActiveTab('members');
  };

  return (
    <section className="section">
      <h2>Moje Tablice</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="board-tabs">
        <button 
          className={activeTab === 'boards' ? 'active' : ''} 
          onClick={() => setActiveTab('boards')}
        >
          Boards
        </button>
        <button 
          className={activeTab === 'members' ? 'active' : ''} 
          onClick={() => setActiveTab('members')}
          disabled={!selectedBoardId}
        >
          Board Members
        </button>
      </div>

      {activeTab === 'boards' && (
        <>
          <div className="board-actions">
            <button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Anuluj' : 'Utworz Nowa Tablice'}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateBoard} className="create-form">
              <div className="form-group">
                <label htmlFor="board-name">Nazwa Tablicy</label>
                <input 
                  type="text" 
                  id="board-name" 
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  required 
                />
              </div>
              <button type="submit">Utworz</button>
            </form>
          )}

          <div className="boards-layout">
            <div className="boards-container">
              {boards.length === 0 ? (
                <p>Nie znaleziono tablic. Stwórz nową tablicę aby zacząć.</p>
              ) : (
                boards.map(board => (
                  <div key={board.id} className="board-card">
                    <h3>{board.name}</h3>
                    <div className="board-card-actions">
                      <button 
                        className="view-board-btn" 
                        onClick={() => handleViewBoard(board.id)}
                      >
                        Pokaz Tabele
                      </button>

                      <button 
                        className="manage-members-btn" 
                        onClick={() => handleSelectBoard(board.id)}
                      >
                        Zarzadzaj uzytkownikami
                      </button>

                      {/* Only show delete button if user is the owner */}
                      {board.owner && currentUser && board.owner.id === parseInt(currentUser.id) && (
                        <button 
                          className="delete-board-btn danger-btn" 
                          onClick={() => handleDeleteBoard(board.id)}
                        >
                          Usuń
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'members' && selectedBoardId && (
        <div className="board-members-tab">
          <div className="back-to-boards">
            <button onClick={() => setActiveTab('boards')}>← Back to Boards</button>
          </div>
          <BoardMembers boardId={selectedBoardId} />
        </div>
      )}
    </section>
  );
};

export default Boards;
