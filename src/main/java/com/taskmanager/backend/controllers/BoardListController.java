package com.taskmanager.backend.controllers;

import com.taskmanager.backend.models.Board;
import com.taskmanager.backend.models.BoardList;
import com.taskmanager.backend.models.User;
import com.taskmanager.backend.payload.response.MessageResponse;
import com.taskmanager.backend.repositories.BoardListRepository;
import com.taskmanager.backend.repositories.BoardRepository;
import com.taskmanager.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/boards/{boardId}/lists")
public class BoardListController {
    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardListRepository boardListRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getBoardLists(@PathVariable Long boardId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        List<BoardList> lists = boardListRepository.findByBoardOrderByPosition(board);

        return ResponseEntity.ok(lists);
    }

    @PostMapping
    public ResponseEntity<?> createBoardList(@PathVariable Long boardId, @Valid @RequestBody BoardList boardListRequest) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        // Get the highest position value
        List<BoardList> existingLists = boardListRepository.findByBoardOrderByPosition(board);
        int position = 0;
        if (!existingLists.isEmpty()) {
            position = existingLists.get(existingLists.size() - 1).getPosition() + 1;
        }

        BoardList boardList = new BoardList(boardListRequest.getName(), position, board);
        boardListRepository.save(boardList);

        return ResponseEntity.ok(boardList);
    }

    @PutMapping("/{listId}")
    public ResponseEntity<?> updateBoardList(@PathVariable Long boardId, @PathVariable Long listId, 
                                            @Valid @RequestBody BoardList boardListRequest) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> boardListOptional = boardListRepository.findById(listId);
        if (!boardListOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List not found!"));
        }

        BoardList boardList = boardListOptional.get();

        // Check if list belongs to the specified board
        if (!boardList.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        boardList.setName(boardListRequest.getName());
        if (boardListRequest.getPosition() != 0) {
            boardList.setPosition(boardListRequest.getPosition());
        }

        boardListRepository.save(boardList);

        return ResponseEntity.ok(boardList);
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<?> deleteBoardList(@PathVariable Long boardId, @PathVariable Long listId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> boardListOptional = boardListRepository.findById(listId);
        if (!boardListOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List not found!"));
        }

        BoardList boardList = boardListOptional.get();

        // Check if list belongs to the specified board
        if (!boardList.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        boardListRepository.delete(boardList);

        return ResponseEntity.ok(new MessageResponse("List deleted successfully!"));
    }
}
