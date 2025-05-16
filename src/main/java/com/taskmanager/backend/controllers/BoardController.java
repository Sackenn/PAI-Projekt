package com.taskmanager.backend.controllers;

import com.taskmanager.backend.models.Board;
import com.taskmanager.backend.models.User;
import com.taskmanager.backend.payload.response.MessageResponse;
import com.taskmanager.backend.repositories.BoardRepository;
import com.taskmanager.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Kontroler do zarządzania tablicami
 * Uproszczona wersja dla projektu studenckiego
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/boards")
public class BoardController {
    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Pobierz wszystkie tablice dla użytkownika
     * @param userId ID użytkownika
     * @return lista tablic, w których użytkownik jest właścicielem lub członkiem
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBoards(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        User user = userOptional.get();

        // Pobierz tablice, w których użytkownik jest właścicielem lub członkiem
        List<Board> ownedBoards = boardRepository.findByOwner(user);
        List<Board> memberBoards = boardRepository.findByMembersContaining(user);

        // Połącz i usuń duplikaty
        List<Board> allBoards = Stream.concat(ownedBoards.stream(), memberBoards.stream())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(allBoards);
    }

    /**
     * Utwórz nową tablicę
     * @param userId ID użytkownika tworzącego tablicę
     * @param boardRequest dane tablicy
     * @return utworzona tablica
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createBoard(@PathVariable Long userId, @Valid @RequestBody Board boardRequest) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        User user = userOptional.get();

        Board board = new Board(boardRequest.getName(), user);
        boardRepository.save(board);

        return ResponseEntity.ok(board);
    }

    /**
     * Pobierz tablicę po ID
     * @param id ID tablicy
     * @param userId ID użytkownika żądającego tablicy
     * @return tablica, jeśli użytkownik ma dostęp
     */
    @GetMapping("/{id}/user/{userId}")
    public ResponseEntity<?> getBoardById(@PathVariable Long id, @PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        User user = userOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        // Sprawdź, czy użytkownik jest właścicielem lub członkiem
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: You don't have access to this board!"));
        }

        return ResponseEntity.ok(board);
    }

    /**
     * Aktualizuj tablicę
     * @param id ID tablicy
     * @param userId ID użytkownika aktualizującego tablicę
     * @param boardRequest zaktualizowane dane tablicy
     * @return zaktualizowana tablica
     */
    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<?> updateBoard(@PathVariable Long id, @PathVariable Long userId, @Valid @RequestBody Board boardRequest) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        User user = userOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        // Sprawdź, czy użytkownik jest właścicielem
        if (!board.getOwner().equals(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Only the board owner can update it!"));
        }

        board.setName(boardRequest.getName());
        boardRepository.save(board);

        return ResponseEntity.ok(board);
    }

    /**
     * Usuń tablicę
     * @param id ID tablicy
     * @param userId ID użytkownika usuwającego tablicę
     * @return komunikat o powodzeniu, jeśli usunięcie się powiodło
     */
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id, @PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        User user = userOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        // Sprawdź, czy użytkownik jest właścicielem
        if (!board.getOwner().equals(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Only the board owner can delete it!"));
        }

        boardRepository.delete(board);

        return ResponseEntity.ok(new MessageResponse("Board deleted successfully!"));
    }

    /**
     * Dodaj członka do tablicy
     * @param id ID tablicy
     * @param ownerId ID właściciela tablicy
     * @param userId ID użytkownika do dodania jako członka
     * @return komunikat o powodzeniu, jeśli dodanie się powiodło
     */
    @PostMapping("/{id}/owner/{ownerId}/members/{userId}")
    public ResponseEntity<?> addMemberToBoard(@PathVariable Long id, @PathVariable Long ownerId, @PathVariable Long userId) {
        Optional<User> ownerOptional = userRepository.findById(ownerId);
        if (!ownerOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Owner not found!"));
        }

        User owner = ownerOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        // Sprawdź, czy użytkownik jest właścicielem
        if (!board.getOwner().equals(owner)) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Only the board owner can add members!"));
        }

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Member user not found!"));
        }

        User memberUser = memberUserOptional.get();

        // Dodaj członka do tablicy
        board.addMember(memberUser);
        boardRepository.save(board);

        return ResponseEntity.ok(new MessageResponse("Member added to board successfully!"));
    }

    /**
     * Usuń członka z tablicy
     * @param id ID tablicy
     * @param ownerId ID właściciela tablicy
     * @param userId ID użytkownika do usunięcia jako członka
     * @return komunikat o powodzeniu, jeśli usunięcie się powiodło
     */
    @DeleteMapping("/{id}/owner/{ownerId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromBoard(@PathVariable Long id, @PathVariable Long ownerId, @PathVariable Long userId) {
        Optional<User> ownerOptional = userRepository.findById(ownerId);
        if (!ownerOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Owner not found!"));
        }

        User owner = ownerOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Board not found!"));
        }

        Board board = boardOptional.get();

        // Sprawdź, czy użytkownik jest właścicielem
        if (!board.getOwner().equals(owner)) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Only the board owner can remove members!"));
        }

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Member user not found!"));
        }

        User memberUser = memberUserOptional.get();

        // Usuń członka z tablicy
        board.removeMember(memberUser);
        boardRepository.save(board);

        return ResponseEntity.ok(new MessageResponse("Member removed from board successfully!"));
    }
}
