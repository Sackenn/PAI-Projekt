package com.taskmanager.backend.controllers;

import com.taskmanager.backend.models.*;
import com.taskmanager.backend.payload.response.MessageResponse;
import com.taskmanager.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/boards/{boardId}/lists/{listId}/cards/{cardId}/tasks")
public class TaskController {
    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardListRepository boardListRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getCardTasks(@PathVariable Long boardId, @PathVariable Long listId, 
                                         @PathVariable Long cardId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> listOptional = boardListRepository.findById(listId);
        if (!listOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List not found!"));
        }

        BoardList list = listOptional.get();

        // Check if list belongs to the specified board
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card not found!"));
        }

        Card card = cardOptional.get();

        // Check if card belongs to the specified list
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card does not belong to the specified list!"));
        }

        List<Task> tasks = taskRepository.findByCard(card);

        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<?> createTask(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @PathVariable Long cardId, @Valid @RequestBody Task taskRequest) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> listOptional = boardListRepository.findById(listId);
        if (!listOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List not found!"));
        }

        BoardList list = listOptional.get();

        // Check if list belongs to the specified board
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card not found!"));
        }

        Card card = cardOptional.get();

        // Check if card belongs to the specified list
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card does not belong to the specified list!"));
        }

        Task task = new Task(taskRequest.getDescription(), card);
        taskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @PathVariable Long cardId, @PathVariable Long taskId, 
                                       @Valid @RequestBody Task taskRequest) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> listOptional = boardListRepository.findById(listId);
        if (!listOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List not found!"));
        }

        BoardList list = listOptional.get();

        // Check if list belongs to the specified board
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card not found!"));
        }

        Card card = cardOptional.get();

        // Check if card belongs to the specified list
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card does not belong to the specified list!"));
        }

        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (!taskOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Task not found!"));
        }

        Task task = taskOptional.get();

        // Check if task belongs to the specified card
        if (!task.getCard().getId().equals(cardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Task does not belong to the specified card!"));
        }

        task.setDescription(taskRequest.getDescription());
        task.setCompleted(taskRequest.isCompleted());

        taskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @PathVariable Long cardId, @PathVariable Long taskId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> listOptional = boardListRepository.findById(listId);
        if (!listOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List not found!"));
        }

        BoardList list = listOptional.get();

        // Check if list belongs to the specified board
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card not found!"));
        }

        Card card = cardOptional.get();

        // Check if card belongs to the specified list
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card does not belong to the specified list!"));
        }

        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (!taskOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Task not found!"));
        }

        Task task = taskOptional.get();

        // Check if task belongs to the specified card
        if (!task.getCard().getId().equals(cardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Task does not belong to the specified card!"));
        }

        taskRepository.delete(task);

        return ResponseEntity.ok(new MessageResponse("Task deleted successfully!"));
    }
}
