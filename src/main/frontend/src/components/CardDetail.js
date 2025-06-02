import React, { useState, useEffect } from 'react';
import { 
  fetchCardDetails, 
  fetchCardTasks, 
  fetchGlobalLabels,
  updateCard, 
  deleteCard,
  createTask,
  updateTask,
  deleteTask,
  addLabelToCard,
  addGlobalLabelToCard,
  removeLabelFromCard,
  createGlobalLabel,
  deleteGlobalLabel
} from '../services/api';

const CardDetail = ({ boardId, listId, cardId, onClose, onCardUpdate, onCardDelete }) => {
  // Card data state
  const [card, setCard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [globalLabels, setGlobalLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Task form state
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Label form state
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState('#4CAF50');
  const [isGlobalLabel, setIsGlobalLabel] = useState(false);

  useEffect(() => {
    loadCardData();
  }, [boardId, listId, cardId]); // eslint-disable-line react-hooks/exhaustive-deps

  // We're using eslint-disable-line above because including loadCardData in the dependency array
  // would cause an infinite loop since loadCardData is recreated on each render

  const loadCardData = async () => {
    try {
      setLoading(true);

      // Fetch card details
      const cardData = await fetchCardDetails(boardId, listId, cardId);
      setCard(cardData);

      // Set form values
      setTitle(cardData.title || '');
      setDescription(cardData.description || '');
      setStartDate(cardData.startDate ? formatDateForInput(cardData.startDate) : '');
      setDueDate(cardData.dueDate ? formatDateForInput(cardData.dueDate) : '');

      // Fetch tasks
      const tasksData = await fetchCardTasks(boardId, listId, cardId);
      setTasks(tasksData);

      // Fetch global labels
      const labelsData = await fetchGlobalLabels();
      setGlobalLabels(labelsData);

      setError('');
    } catch (err) {
      console.error('Error loading card data:', err);
      setError('Failed to load card data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  const handleSaveCard = async () => {
    try {
      if (!title.trim()) {
        setError('Card title cannot be empty');
        return;
      }

      const updatedCard = await updateCard(boardId, listId, cardId, {
        title,
        description
      });

      setCard(updatedCard);
      if (onCardUpdate) onCardUpdate(updatedCard);
      setError('');
      onClose(); // Close the modal after saving
    } catch (err) {
      console.error('Error updating card:', err);
      setError('Failed to update card. Please try again.');
    }
  };

  const handleSaveDates = async () => {
    try {
      const dateData = {
        startDate: startDate || null,
        dueDate: dueDate || null
      };

      const updatedCard = await updateCard(boardId, listId, cardId, dateData);

      setCard(updatedCard);
      if (onCardUpdate) onCardUpdate(updatedCard);
      setError('');
    } catch (err) {
      console.error('Error updating card dates:', err);
      setError('Failed to update card dates. Please try again.');
    }
  };

  const handleDeleteCard = async () => {
    try {
      if (!window.confirm('Czy na pewno chcesz usunac ta karte? Nie bedzie mozna tego cofnac.')) {
        return;
      }

      await deleteCard(boardId, listId, cardId);

      if (onCardDelete) onCardDelete(cardId);
      onClose();
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Failed to delete card. Please try again.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      if (!newTaskDescription.trim()) {
        setError('Task description cannot be empty');
        return;
      }

      const newTask = await createTask(boardId, listId, cardId, {
        description: newTaskDescription,
        completed: false
      });

      setTasks([...tasks, newTask]);
      setNewTaskDescription('');
      setError('');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    }
  };

  const handleToggleTaskCompletion = async (taskId, completed) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = await updateTask(boardId, listId, cardId, taskId, {
        description: taskToUpdate.description,
        completed: !completed
      });

      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(boardId, listId, cardId, taskId);

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleAddLabel = async (e) => {
    e.preventDefault();

    try {
      if (!labelName.trim()) {
        setError('Label name cannot be empty');
        return;
      }

      if (isGlobalLabel) {
        // Create a global label
        const newGlobalLabel = await createGlobalLabel({
          name: labelName,
          color: labelColor
        });

        // Add the global label to the card
        await addGlobalLabelToCard(boardId, listId, cardId, newGlobalLabel.id);

        // Update global labels list
        setGlobalLabels([...globalLabels, newGlobalLabel]);
      } else {
        // Add a card-specific label
        await addLabelToCard(boardId, listId, cardId, {
          name: labelName,
          color: labelColor
        });
      }

      // Reload card data to get updated labels
      await loadCardData();

      // Reset form
      setLabelName('');
      setLabelColor('#4CAF50');
      setIsGlobalLabel(false);
      setError('');
    } catch (err) {
      console.error('Error adding label:', err);
      setError('Failed to add label. Please try again.');
    }
  };

  const handleAddGlobalLabelToCard = async (labelId) => {
    try {
      await addGlobalLabelToCard(boardId, listId, cardId, labelId);

      // Reload card data to get updated labels
      await loadCardData();
    } catch (err) {
      console.error('Error adding global label to card:', err);
      setError('Failed to add global label to card. Please try again.');
    }
  };

  const handleRemoveLabelFromCard = async (labelId) => {
    try {
      await removeLabelFromCard(boardId, listId, cardId, labelId);

      // Reload card data to get updated labels
      await loadCardData();
    } catch (err) {
      console.error('Error removing label from card:', err);
      setError('Failed to remove label from card. Please try again.');
    }
  };

  const handleDeleteGlobalLabel = async (labelId) => {
    try {
      // Confirm before deleting
      if (!window.confirm('Czy na pewno chcesz usunac ta globalna etykiete? Zostanie ona usunieta ze wszystkich kart.')) {
        return;
      }

      await deleteGlobalLabel(labelId);

      // Update the global labels list
      setGlobalLabels(globalLabels.filter(label => label.id !== labelId));

      // Reload card data to update any labels on the card
      await loadCardData();
    } catch (err) {
      console.error('Error deleting global label:', err);
      setError('Failed to delete global label. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <span className="close-modal" onClick={onClose}>&times;</span>
          <p>Loading card details...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <span className="close-modal" onClick={onClose}>&times;</span>
          <p>Card not found or error loading card details.</p>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2>{card.title}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="card-title-input">Title</label>
          <input 
            type="text" 
            id="card-title-input" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="card-description-input">Description</label>
          <textarea 
            id="card-description-input" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>

        <div className="dates-section">
          <h3>Dates</h3>
          <div className="date-info">
            <p>Created: {card.creationDate ? new Date(card.creationDate).toLocaleString() : 'Not available'}</p>
          </div>
          <div className="form-group">
            <label htmlFor="card-start-date">Start Date</label>
            <input 
              type="datetime-local" 
              id="card-start-date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="card-due-date">Due Date</label>
            <input 
              type="datetime-local" 
              id="card-due-date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <button onClick={handleSaveDates}>Save Dates</button>
        </div>

        <div className="labels-section">
          <h3>Labels</h3>
          <div className="labels-container">
            {card.labels && card.labels.length > 0 ? (
              card.labels.map(label => (
                <div 
                  key={label.id} 
                  className="label" 
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                  <span 
                    className="label-delete" 
                    onClick={() => handleRemoveLabelFromCard(label.id)}
                  >
                    &times;
                  </span>
                </div>
              ))
            ) : (
              <p>No labels added to this card yet.</p>
            )}
          </div>

          <div className="global-labels-section">
            <h4>Global Labels</h4>
            <div className="global-labels-container">
              {globalLabels.length > 0 ? (
                globalLabels.map(label => (
                  <div 
                    key={label.id} 
                    className="global-label" 
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                    <span 
                      className="global-label-add" 
                      onClick={() => handleAddGlobalLabelToCard(label.id)}
                      title="Add to card"
                    >
                      +
                    </span>
                    <span 
                      className="global-label-delete" 
                      onClick={() => handleDeleteGlobalLabel(label.id)}
                      title="Usuń globalną etykietę"
                    >
                      &times;
                    </span>
                  </div>
                ))
              ) : (
                <p>No global labels available.</p>
              )}
            </div>
          </div>

          <div className="add-label-form">
            <h4>Add Label</h4>
            <form onSubmit={handleAddLabel}>
              <div className="form-group">
                <label htmlFor="label-name-input">Label Name</label>
                <input 
                  type="text" 
                  id="label-name-input" 
                  value={labelName}
                  onChange={(e) => setLabelName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="label-color-input">Color</label>
                <input 
                  type="color" 
                  id="label-color-input" 
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                />
              </div>
              <div className="form-group checkbox-group">
                <label htmlFor="global-label-checkbox">
                  <input 
                    type="checkbox" 
                    id="global-label-checkbox" 
                    checked={isGlobalLabel}
                    onChange={(e) => setIsGlobalLabel(e.target.checked)}
                  />
                  Set as Global Label
                </label>
              </div>
              <button type="submit">Add Label</button>
            </form>
          </div>
        </div>

        <div className="tasks-section">
          <h3>Zadania</h3>
          <div className="tasks-container">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'task-completed' : ''}`}>
                  <input 
                    type="checkbox" 
                    className="task-checkbox" 
                    checked={task.completed}
                    onChange={() => handleToggleTaskCompletion(task.id, task.completed)}
                  />
                  <span className={task.completed ? 'task-completed' : ''}>
                    {task.description}
                  </span>
                  <span 
                    className="task-delete" 
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    &times;
                  </span>
                </div>
              ))
            ) : (
              <p>Nie dodano jeszcze zadań do tej karty.</p>
            )}
          </div>

          <div className="add-task-form">
            <h4>Dodaj zadanie</h4>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label htmlFor="task-description-input">Opis zadania</label>
                <input 
                  type="text" 
                  id="task-description-input" 
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Dodaj zadanie</button>
            </form>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleSaveCard}>Zapisz kartę</button>
          <button onClick={handleDeleteCard} className="danger-btn">Usuń kartę</button>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
