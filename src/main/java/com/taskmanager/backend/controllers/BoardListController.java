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
    public ResponseEntity<?> getBoardLists(@PathVariable Long boardId, @RequestParam Long userId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem lub czlonkiem tablicy
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Nie masz uprawnien do przegladania list tej tablicy!"));
        }

        List<BoardList> lists = boardListRepository.findByBoardOrderByPosition(board);

        return ResponseEntity.ok(lists);
    }

    @PostMapping
    public ResponseEntity<?> createBoardList(@PathVariable Long boardId, @Valid @RequestBody BoardList boardListRequest, @RequestParam(required = false) Long userId) {

        // Jesli userId jest null, zwroc komunikat o bledzie
        if (userId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: userId jest wymagane!"));
        }
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem tablicy lub czlonkiem tablicy
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel tablicy lub czlonkowie moga tworzyc listy!"));
        }

        // Pobierz najwyzsza wartosc pozycji
        List<BoardList> existingLists = boardListRepository.findByBoardOrderByPosition(board);
        int position = 0;
        if (!existingLists.isEmpty()) {
            position = existingLists.get(existingLists.size() - 1).getPosition() + 1;
        }

        BoardList boardList = new BoardList(boardListRequest.getName(), position, board, user);
        boardListRepository.save(boardList);

        return ResponseEntity.ok(boardList);
    }

    @PutMapping("/{listId}")
    public ResponseEntity<?> updateBoardList(@PathVariable Long boardId, @PathVariable Long listId, 
                                            @Valid @RequestBody BoardList boardListRequest, @RequestParam Long userId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> boardListOptional = boardListRepository.findById(listId);
        if (!boardListOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie znaleziona!"));
        }

        BoardList boardList = boardListOptional.get();

        // Sprawdz czy lista nalezy do okreslonej tablicy
        if (!boardList.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie nalezy do okreslonej tablicy!"));
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem listy, czlonkiem listy lub czlonkiem tablicy
        if (!boardList.getOwner().equals(user) && !boardList.getMembers().contains(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel listy, czlonkowie listy lub czlonkowie tablicy moga ja aktualizowac!"));
        }

        boardList.setName(boardListRequest.getName());
        if (boardListRequest.getPosition() != 0) {
            boardList.setPosition(boardListRequest.getPosition());
        }

        boardListRepository.save(boardList);

        return ResponseEntity.ok(boardList);
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<?> deleteBoardList(@PathVariable Long boardId, @PathVariable Long listId, @RequestParam Long userId) {
        Optional<Board> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        Optional<BoardList> boardListOptional = boardListRepository.findById(listId);
        if (!boardListOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie znaleziona!"));
        }

        BoardList boardList = boardListOptional.get();

        // Sprawdz czy lista nalezy do okreslonej tablicy
        if (!boardList.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Lista nie nalezy do okreslonej tablicy!"));
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem listy lub czlonkiem tablicy
        if (!boardList.getOwner().equals(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel listy lub czlonkowie tablicy moga ja usunac!"));
        }

        boardListRepository.delete(boardList);

        return ResponseEntity.ok(new MessageResponse("Lista usunieta pomyslnie!"));
    }

}
