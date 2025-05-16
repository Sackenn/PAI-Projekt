package com.taskmanager.backend.repositories;

import com.taskmanager.backend.models.Card;
import com.taskmanager.backend.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCard(Card card);
    
    List<Task> findByCardAndCompleted(Card card, boolean completed);
    
    int countByCardAndCompleted(Card card, boolean completed);
}