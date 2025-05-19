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
                                         @PathVariable Long cardId, @RequestParam Long userId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> listOptional = boardListRepository.findById(listId);
        if (!listOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie znaleziona!"));
        }

        BoardList list = listOptional.get();

        // Sprawdz czy lista nalezy do okreslonej tablicy
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie nalezy do okreslonej tablicy!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Karta nie znaleziona!"));
        }

        Card card = cardOptional.get();

        // Sprawdz czy karta nalezy do okreslonej listy
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Karta nie nalezy do okreslonej listy!"));
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem tablicy, czlonkiem tablicy, wlascicielem listy, czlonkiem listy,
        // wlascicielem karty lub czlonkiem karty
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user) && 
            !list.getOwner().equals(user) && !list.getMembers().contains(user) &&
            !card.getOwner().equals(user) && !card.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Nie masz uprawnien do przegladania zadan tej karty!"));
        }

        List<Task> tasks = taskRepository.findByCard(card);

        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<?> createTask(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @PathVariable Long cardId, @Valid @RequestBody Task taskRequest, @RequestParam Long userId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> listOptional = boardListRepository.findById(listId);
        if (!listOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie znaleziona!"));
        }

        BoardList list = listOptional.get();

        // Sprawdz czy lista nalezy do okreslonej tablicy
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie nalezy do okreslonej tablicy!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Karta nie znaleziona!"));
        }

        Card card = cardOptional.get();

        // Sprawdz czy karta nalezy do okreslonej listy
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Karta nie nalezy do okreslonej listy!"));
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik ma dostep do tablicy (jest wlascicielem lub czlonkiem tablicy)
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko osoby z dostepem do tablicy moga tworzyc zadania!"));
        }

        Task task = new Task(taskRequest.getDescription(), card, user);
        taskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @PathVariable Long cardId, @PathVariable Long taskId, 
                                       @RequestBody Task taskRequest, @RequestParam Long userId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> listOptional = boardListRepository.findById(listId);
        if (!listOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie znaleziona!"));
        }

        BoardList list = listOptional.get();

        // Sprawdz czy lista nalezy do okreslonej tablicy
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie nalezy do okreslonej tablicy!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Karta nie znaleziona!"));
        }

        Card card = cardOptional.get();

        // Sprawdz czy karta nalezy do okreslonej listy
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Karta nie nalezy do okreslonej listy!"));
        }

        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (!taskOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Zadanie nie znalezione!"));
        }

        Task task = taskOptional.get();

        // Sprawdz czy zadanie nalezy do okreslonej karty
        if (!task.getCard().getId().equals(cardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Zadanie nie nalezy do okreslonej karty!"));
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik ma dostep do tablicy (jest wlascicielem lub czlonkiem tablicy)
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko osoby z dostepem do tablicy moga aktualizowac zadania!"));
        }

        // Aktualizuj opis tylko jesli jest podany w zadaniu
        if (taskRequest.getDescription() != null && !taskRequest.getDescription().isEmpty()) {
            task.setDescription(taskRequest.getDescription());
        }

        // Zawsze aktualizuj status ukonczenia
        task.setCompleted(taskRequest.isCompleted());

        taskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @PathVariable Long cardId, @PathVariable Long taskId, @RequestParam Long userId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> listOptional = boardListRepository.findById(listId);
        if (!listOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie znaleziona!"));
        }

        BoardList list = listOptional.get();

        // Sprawdz czy lista nalezy do okreslonej tablicy
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie nalezy do okreslonej tablicy!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Karta nie znaleziona!"));
        }

        Card card = cardOptional.get();

        // Sprawdz czy karta nalezy do okreslonej listy
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Karta nie nalezy do okreslonej listy!"));
        }

        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (!taskOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Zadanie nie znalezione!"));
        }

        Task task = taskOptional.get();

        // Sprawdz czy zadanie nalezy do okreslonej karty
        if (!task.getCard().getId().equals(cardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Zadanie nie nalezy do okreslonej karty!"));
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik ma dostep do tablicy (jest wlascicielem lub czlonkiem tablicy)
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko osoby z dostepem do tablicy moga usuwac zadania!"));
        }

        taskRepository.delete(task);

        return ResponseEntity.ok(new MessageResponse("Zadanie usuniete pomyslnie!"));
    }
}
