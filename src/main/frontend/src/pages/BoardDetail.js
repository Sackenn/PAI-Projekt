import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchBoardDetails, 
  fetchBoardLists, 
  fetchCards, 
  createList, 
  createCard, 
  updateList, 
  deleteList, 
  updateCard, 
  deleteCard 
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import CardDetail from '../components/CardDetail';

const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for creating new list
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState('');

  // State for editing list
  const [editingListId, setEditingListId] = useState(null);
  const [editListName, setEditListName] = useState('');

  // State for creating new card
  const [addingCardToListId, setAddingCardToListId] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

  // State for card detail modal
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!boardId) {
      navigate('/boards');
      return;
    }

    loadBoardData();
  }, [boardId, currentUser, navigate]);

  const loadBoardData = async () => {
    try {
      setLoading(true);

      // Fetch board details
      const boardData = await fetchBoardDetails(boardId);
      setBoard(boardData);

      // Fetch lists for this board
      const listsData = await fetchBoardLists(boardId);

      // For each list, fetch its cards
      const listsWithCards = await Promise.all(
        listsData.map(async (list) => {
          const cards = await fetchCards(boardId, list.id);
          return { ...list, cards };
        })
      );

      setLists(listsWithCards);
      setError('');
    } catch (err) {
      console.error('Error loading board data:', err);
      setError('Failed to load board data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async (e) => {
    e.preventDefault();

    if (!newListName.trim()) {
      setError('List name cannot be empty');
      return;
    }

    try {
      const newList = await createList(boardId, { name: newListName });
      setLists([...lists, { ...newList, cards: [] }]);
      setNewListName('');
      setShowAddList(false);
      setError('');
    } catch (err) {
      console.error('Error creating list:', err);
      setError('Failed to create list. Please try again.');
    }
  };

  const handleEditList = async (listId) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      setEditingListId(listId);
      setEditListName(list.name);
    }
  };

  const handleUpdateList = async (e, listId) => {
    e.preventDefault();

    if (!editListName.trim()) {
      setError('List name cannot be empty');
      return;
    }

    try {
      const updatedList = await updateList(boardId, listId, { name: editListName });
      setLists(lists.map(list => 
        list.id === listId ? { ...list, name: updatedList.name } : list
      ));
      setEditingListId(null);
      setEditListName('');
      setError('');
    } catch (err) {
      console.error('Error updating list:', err);
      setError('Failed to update list. Please try again.');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Czy na pewno chcesz usunac ta liste? Nie bedzie mozna tego cofnac.\n')) {
      return;
    }

    try {
      await deleteList(boardId, listId);
      setLists(lists.filter(list => list.id !== listId));
    } catch (err) {
      console.error('Error deleting list:', err);
      setError('Failed to delete list. Please try again.');
    }
  };

  const handleAddCard = async (e, listId) => {
    e.preventDefault();

    if (!newCardTitle.trim()) {
      setError('Card title cannot be empty');
      return;
    }

    try {
      const newCard = await createCard(boardId, listId, { 
        title: newCardTitle,
        description: newCardDescription 
      });

      setLists(lists.map(list => 
        list.id === listId 
          ? { ...list, cards: [...list.cards, newCard] } 
          : list
      ));

      setNewCardTitle('');
      setNewCardDescription('');
      setAddingCardToListId(null);
      setError('');
    } catch (err) {
      console.error('Error creating card:', err);
      setError('Failed to create card. Please try again.');
    }
  };

  const handleCardClick = (listId, cardId) => {
    setSelectedListId(listId);
    setSelectedCard(cardId);
  };

  const handleCloseCardDetail = () => {
    setSelectedCard(null);
    setSelectedListId(null);
  };

  const handleCardUpdate = (updatedCard) => {
    // Update the card in the lists state
    setLists(lists.map(list => {
      if (list.id === selectedListId) {
        return {
          ...list,
          cards: list.cards.map(card => 
            card.id === updatedCard.id ? updatedCard : card
          )
        };
      }
      return list;
    }));
  };

  const handleCardDelete = (cardId) => {
    // Remove the card from the lists state
    setLists(lists.map(list => {
      if (list.id === selectedListId) {
        return {
          ...list,
          cards: list.cards.filter(card => card.id !== cardId)
        };
      }
      return list;
    }));
  };

  if (loading) {
    return <div className="section">Loading...</div>;
  }

  if (!board) {
    return (
      <div className="section">
        <h2>Board not found</h2>
        <button onClick={() => navigate('/boards')}>Back to Boards</button>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="board-header">
        <h2>{board.name}</h2>
        <div className="board-actions">
          <button onClick={() => setShowAddList(!showAddList)}>
            {showAddList ? 'Cancel' : 'Add List'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddList && (
        <form onSubmit={handleAddList} className="create-form">
          <div className="form-group">
            <label htmlFor="list-name">List Name</label>
            <input 
              type="text" 
              id="list-name" 
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              required 
            />
          </div>
          <button type="submit">Create List</button>
        </form>
      )}

      <div className="lists-container">
        {lists.map(list => (
          <div key={list.id} className="list-column">
            <div className="list-header">
              {editingListId === list.id ? (
                <form onSubmit={(e) => handleUpdateList(e, list.id)}>
                  <input 
                    type="text" 
                    value={editListName}
                    onChange={(e) => setEditListName(e.target.value)}
                    required 
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingListId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <h3>{list.name}</h3>
                  <div className="list-header-actions">
                    <button 
                      className="edit-list-btn" 
                      onClick={() => handleEditList(list.id)}
                    >
                      Edytuj
                    </button>
                    <button 
                      className="delete-list-btn danger-btn" 
                      onClick={() => handleDeleteList(list.id)}
                    >
                      Usuń
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="cards-container">
              {list.cards && list.cards.map(card => (
                <div 
                  key={card.id} 
                  className="card" 
                  onClick={() => handleCardClick(list.id, card.id)}
                >
                  {card.labels && card.labels.length > 0 && (
                    <div className="card-labels">
                      {card.labels.map(label => (
                        <div 
                          key={label.id} 
                          className="card-label" 
                          style={{ backgroundColor: label.color }} 
                          title={label.name}
                        ></div>
                      ))}
                    </div>
                  )}

                  <h4>{card.title}</h4>
                  {card.description && <p>{card.description}</p>}

                  {card.dueDate && (
                    <div className="card-dates">
                      Due: {new Date(card.dueDate).toLocaleDateString()}
                    </div>
                  )}

                  {card.tasks && card.tasks.length > 0 && (
                    <div className="card-tasks">
                      {card.tasks.filter(task => task.completed).length}/{card.tasks.length} zadania
                    </div>
                  )}
                </div>
              ))}
            </div>

            {addingCardToListId === list.id ? (
              <form onSubmit={(e) => handleAddCard(e, list.id)} className="add-card-form">
                <div className="form-group">
                  <label htmlFor={`card-title-${list.id}`}>Title</label>
                  <input 
                    type="text" 
                    id={`card-title-${list.id}`} 
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`card-description-${list.id}`}>Description</label>
                  <textarea 
                    id={`card-description-${list.id}`} 
                    value={newCardDescription}
                    onChange={(e) => setNewCardDescription(e.target.value)}
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit">Dodaj karte</button>
                  <button 
                    type="button" 
                    onClick={() => setAddingCardToListId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button 
                className="add-card-btn" 
                onClick={() => setAddingCardToListId(list.id)}
              >
                + Dodaj karte
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetail 
          boardId={parseInt(boardId, 10)}
          listId={selectedListId}
          cardId={selectedCard}
          onClose={handleCloseCardDetail}
          onCardUpdate={handleCardUpdate}
          onCardDelete={handleCardDelete}
        />
      )}
    </section>
  );
};

export default BoardDetail;
