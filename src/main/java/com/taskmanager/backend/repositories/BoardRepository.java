package com.taskmanager.backend.repositories;

import com.taskmanager.backend.models.Board;
import com.taskmanager.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByOwner(User owner);
    
    List<Board> findByMembersContaining(User member);
}