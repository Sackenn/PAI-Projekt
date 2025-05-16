package com.taskmanager.backend.repositories;

import com.taskmanager.backend.models.BoardList;
import com.taskmanager.backend.models.Card;
import com.taskmanager.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByList(BoardList list);
    
    List<Card> findByListOrderByPosition(BoardList list);
    
    List<Card> findByMembersContaining(User member);
    
    @Query("SELECT c FROM Card c WHERE c.dueDate IS NOT NULL AND c.dueDate BETWEEN ?1 AND ?2")
    List<Card> findUpcomingCards(LocalDateTime start, LocalDateTime end);
}