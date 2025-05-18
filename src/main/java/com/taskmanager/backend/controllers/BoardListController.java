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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/boards/{boardId}/lists")
public class BoardListController {
    private static final Logger logger = LoggerFactory.getLogger(BoardListController.class);

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
        logger.info("Tworzenie listy tablicy z boardId: {}, userId: {}, boardListRequest: {}", boardId, userId, boardListRequest);

        // Jesli userId jest null, zwroc komunikat o bledzie
        if (userId == null) {
            logger.error("userId jest null, zwracanie komunikatu o bledzie");
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

        // Sprawdz czy uzytkownik jest wlascicielem tablicy
        if (!board.getOwner().equals(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel tablicy moze tworzyc listy!"));
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

        // Sprawdz czy uzytkownik jest wlascicielem listy
        if (!boardList.getOwner().equals(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel listy moze ja aktualizowac!"));
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

        // Sprawdz czy uzytkownik jest wlascicielem listy
        if (!boardList.getOwner().equals(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel listy moze ja usunac!"));
        }

        boardListRepository.delete(boardList);

        return ResponseEntity.ok(new MessageResponse("Lista usunieta pomyslnie!"));
    }

    /**
     * Dodaj czlonka do listy
     * @param boardId ID tablicy
     * @param listId ID listy
     * @param ownerId ID wlasciciela listy
     * @param userId ID uzytkownika do dodania jako czlonek
     * @return komunikat o powodzeniu, jesli uzytkownik zostal dodany pomyslnie
     */
    @PostMapping("/{listId}/owner/{ownerId}/members/{userId}")
    public ResponseEntity<?> addMemberToList(@PathVariable Long boardId, @PathVariable Long listId, 
                                           @PathVariable Long ownerId, @PathVariable Long userId) {
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

        Optional<User> ownerOptional = userRepository.findById(ownerId);
        if (!ownerOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Wlasciciel nie znaleziony!"));
        }

        User owner = ownerOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem listy
        if (!list.getOwner().equals(owner)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel listy moze dodawac czlonkow!"));
        }

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik czlonek nie znaleziony!"));
        }

        User memberUser = memberUserOptional.get();

        // Dodaj czlonka do listy
        list.addMember(memberUser);
        boardListRepository.save(list);

        return ResponseEntity.ok(new MessageResponse("Czlonek dodany do listy pomyslnie!"));
    }

    /**
     * Usun czlonka z listy
     * @param boardId ID tablicy
     * @param listId ID listy
     * @param ownerId ID wlasciciela listy
     * @param userId ID uzytkownika do usuniecia jako czlonek
     * @return komunikat o powodzeniu, jesli uzytkownik zostal usuniety pomyslnie
     */
    @DeleteMapping("/{listId}/owner/{ownerId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromList(@PathVariable Long boardId, @PathVariable Long listId, 
                                                @PathVariable Long ownerId, @PathVariable Long userId) {
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

        Optional<User> ownerOptional = userRepository.findById(ownerId);
        if (!ownerOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Wlasciciel nie znaleziony!"));
        }

        User owner = ownerOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem listy
        if (!list.getOwner().equals(owner)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel listy moze usuwac czlonkow!"));
        }

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik czlonek nie znaleziony!"));
        }

        User memberUser = memberUserOptional.get();

        // Usun czlonka z listy
        list.removeMember(memberUser);
        boardListRepository.save(list);

        return ResponseEntity.ok(new MessageResponse("Czlonek usuniety z listy pomyslnie!"));
    }
}
