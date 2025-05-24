import React, { useState, useEffect } from 'react';
import { fetchBoardDetails, fetchAllUsers, addMemberToBoard, removeMemberFromBoard, makeOwner } from '../services/api';

const BoardMembers = ({ boardId }) => {
  const [board, setBoard] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (boardId) {
      loadBoardData();
    }
  }, [boardId]);

  const loadBoardData = async () => {
    try {
      setLoading(true);
      
      // Fetch board details
      const boardData = await fetchBoardDetails(boardId);
      setBoard(boardData);
      
      // Fetch all users
      const usersData = await fetchAllUsers();
      setUsers(usersData);
      
      setError('');
    } catch (err) {
      console.error('Error loading board data:', err);
      setError('Failed to load board data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      setError('Please select a user to add');
      return;
    }

    try {
      await addMemberToBoard(boardId, parseInt(selectedUserId, 10));
      
      // Reload board data to get updated members
      await loadBoardData();
      
      // Reset selected user
      setSelectedUserId('');
      setError('');
    } catch (err) {
      console.error('Error adding member to board:', err);
      setError('Failed to add member to board. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMemberFromBoard(boardId, memberId);
      
      // Reload board data to get updated members
      await loadBoardData();
      setError('');
    } catch (err) {
      console.error('Error removing member from board:', err);
      setError('Failed to remove member from board. Please try again.');
    }
  };

  const handleMakeOwner = async (memberId) => {
    try {
      await makeOwner(boardId, memberId);
      
      // Reload board data to get updated members
      await loadBoardData();
      setError('');
    } catch (err) {
      console.error('Error making member the owner:', err);
      setError('Failed to make member the owner. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading board members...</div>;
  }

  if (!board) {
    return <div>Select a board to manage members</div>;
  }

  // Get current user ID
  const currentUserId = parseInt(localStorage.getItem('userId'), 10);
  
  // Check if current user is the owner
  const isOwner = board.owner && board.owner.id === currentUserId;

  return (
    <div className="board-members-management">
      <h4>Add User</h4>
      {error && <div className="error-message">{error}</div>}
      
      <div className="add-member-form">
        <select 
          value={selectedUserId} 
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select a user...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <button onClick={handleAddMember}>Add</button>
      </div>
      
      <h4>Board Members</h4>
      <div className="board-members-list">
        {/* Owner */}
        {board.owner && (
          <div className="member-item">
            <div className="member-info">
              {board.owner.username} <span className="owner-badge">Owner</span>
            </div>
          </div>
        )}
        
        {/* Members */}
        {board.members && board.members.length > 0 ? (
          board.members.map(member => (
            <div key={member.id} className="member-item">
              <div className="member-info">{member.username}</div>
              {isOwner && (
                <div className="member-actions">
                  <button 
                    className="make-owner-btn" 
                    onClick={() => handleMakeOwner(member.id)}
                  >
                    Make Owner
                  </button>
                  <button 
                    className="remove-member-btn" 
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No members added to this board yet.</p>
        )}
      </div>
    </div>
  );
};

export default BoardMembers;