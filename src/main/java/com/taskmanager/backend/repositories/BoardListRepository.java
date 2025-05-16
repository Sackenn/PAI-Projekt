package com.taskmanager.backend.repositories;

import com.taskmanager.backend.models.Board;
import com.taskmanager.backend.models.BoardList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardListRepository extends JpaRepository<BoardList, Long> {
    List<BoardList> findByBoard(Board board);
    
    List<BoardList> findByBoardOrderByPosition(Board board);
}