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
 * Kontroler do zarzadzania tablicami
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
     * Pobierz wszystkie tablice dla uzytkownika
     * @param userId ID uzytkownika
     * @return lista tablic, w ktorych uzytkownik jest wlascicielem lub czlonkiem
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBoards(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        // Pobierz tablice, w ktorych uzytkownik jest wlascicielem lub czlonkiem
        List<Board> ownedBoards = boardRepository.findByOwner(user);
        List<Board> memberBoards = boardRepository.findByMembersContaining(user);

        // Polacz i usun duplikaty
        List<Board> allBoards = Stream.concat(ownedBoards.stream(), memberBoards.stream())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(allBoards);
    }

    /**
     * Utworz nowa tablice
     * @param userId ID uzytkownika tworzacego tablice
     * @param boardRequest dane tablicy
     * @return utworzona tablica
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createBoard(@PathVariable Long userId, @Valid @RequestBody Board boardRequest) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        Board board = new Board(boardRequest.getName(), user);
        boardRepository.save(board);

        return ResponseEntity.ok(board);
    }

    /**
     * Pobierz tablice po ID
     * @param id ID tablicy
     * @param userId ID uzytkownika zadajacego tablicy
     * @return tablica, jesli uzytkownik ma dostep
     */
    @GetMapping("/{id}/user/{userId}")
    public ResponseEntity<?> getBoardById(@PathVariable Long id, @PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        // Sprawdz, czy uzytkownik jest wlascicielem lub czlonkiem
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Nie masz dostepu do tej tablicy!"));
        }

        return ResponseEntity.ok(board);
    }

    /**
     * Aktualizuj tablice
     * @param id ID tablicy
     * @param userId ID uzytkownika aktualizujacego tablice
     * @param boardRequest zaktualizowane dane tablicy
     * @return zaktualizowana tablica
     */
    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<?> updateBoard(@PathVariable Long id, @PathVariable Long userId, @Valid @RequestBody Board boardRequest) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        // Sprawdz, czy uzytkownik jest wlascicielem
        if (!board.getOwner().equals(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel tablicy moze ja aktualizowac!"));
        }

        board.setName(boardRequest.getName());
        boardRepository.save(board);

        return ResponseEntity.ok(board);
    }

    /**
     * Usun tablice
     * @param id ID tablicy
     * @param userId ID uzytkownika usuwajacego tablice
     * @return komunikat o powodzeniu, jesli usuniecie sie powiodlo
     */
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id, @PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        // Sprawdz, czy uzytkownik jest wlascicielem
        if (!board.getOwner().equals(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel tablicy moze ja usunac!"));
        }

        boardRepository.delete(board);

        return ResponseEntity.ok(new MessageResponse("Tablica usunieta pomyslnie!"));
    }

    /**
     * Dodaj czlonka do tablicy
     * @param id ID tablicy
     * @param ownerId ID wlasciciela tablicy
     * @param userId ID uzytkownika do dodania jako czlonka
     * @return komunikat o powodzeniu, jesli dodanie sie powiodlo
     */
    @PostMapping("/{id}/owner/{ownerId}/members/{userId}")
    public ResponseEntity<?> addMemberToBoard(@PathVariable Long id, @PathVariable Long ownerId, @PathVariable Long userId) {
        Optional<User> ownerOptional = userRepository.findById(ownerId);
        if (!ownerOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Wlasciciel nie znaleziony!"));
        }

        User owner = ownerOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        // Sprawdz, czy uzytkownik jest wlascicielem
        if (!board.getOwner().equals(owner)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel tablicy moze dodawac czlonkow!"));
        }

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik czlonek nie znaleziony!"));
        }

        User memberUser = memberUserOptional.get();

        // Dodaj czlonka do tablicy
        board.addMember(memberUser);
        boardRepository.save(board);

        return ResponseEntity.ok(new MessageResponse("Czlonek dodany do tablicy pomyslnie!"));
    }

    /**
     * Usun czlonka z tablicy
     * @param id ID tablicy
     * @param ownerId ID wlasciciela tablicy
     * @param userId ID uzytkownika do usuniecia jako czlonka
     * @return komunikat o powodzeniu, jesli usuniecie sie powiodlo
     */
    @DeleteMapping("/{id}/owner/{ownerId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromBoard(@PathVariable Long id, @PathVariable Long ownerId, @PathVariable Long userId) {
        Optional<User> ownerOptional = userRepository.findById(ownerId);
        if (!ownerOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Wlasciciel nie znaleziony!"));
        }

        User owner = ownerOptional.get();

        Optional<Board> boardOptional = boardRepository.findById(id);
        if (!boardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Tablica nie znaleziona!"));
        }

        Board board = boardOptional.get();

        // Sprawdz, czy uzytkownik jest wlascicielem
        if (!board.getOwner().equals(owner)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel tablicy moze usuwac czlonkow!"));
        }

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik czlonek nie znaleziony!"));
        }

        User memberUser = memberUserOptional.get();

        // Usun czlonka z tablicy
        board.removeMember(memberUser);
        boardRepository.save(board);

        return ResponseEntity.ok(new MessageResponse("Czlonek usuniety z tablicy pomyslnie!"));
    }
}
