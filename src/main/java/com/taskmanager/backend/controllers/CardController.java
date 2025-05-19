package com.taskmanager.backend.controllers;

import com.taskmanager.backend.models.*;
import com.taskmanager.backend.payload.request.LabelRequest;
import com.taskmanager.backend.payload.response.MessageResponse;
import com.taskmanager.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/boards/{boardId}/lists/{listId}/cards")
public class CardController {
    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardListRepository boardListRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LabelRepository labelRepository;

    @GetMapping
    public ResponseEntity<?> getListCards(@PathVariable Long boardId, @PathVariable Long listId, @RequestParam Long userId) {
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

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem tablicy, czlonkiem tablicy, wlascicielem listy lub czlonkiem listy
        if (!board.getOwner().equals(user) && !board.getMembers().contains(user) && 
            !list.getOwner().equals(user) && !list.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Nie masz uprawnien do przegladania kart tej listy!"));
        }

        List<Card> cards = cardRepository.findByListOrderByPosition(list);

        return ResponseEntity.ok(cards);
    }

    @PostMapping
    public ResponseEntity<?> createCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @Valid @RequestBody Card cardRequest, @RequestParam Long userId) {
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

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }
        User user = userOptional.get();

        // Sprawdz czy uzytkownik jest wlascicielem listy lub czlonkiem listy
        if (!list.getOwner().equals(user) && !list.getMembers().contains(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel listy lub czlonkowie moga tworzyc karty!"));
        }

        // Pobierz najwyzsza wartosc pozycji
        List<Card> existingCards = cardRepository.findByListOrderByPosition(list);
        int position = 0;
        if (!existingCards.isEmpty()) {
            position = existingCards.get(existingCards.size() - 1).getPosition() + 1;
        }

        Card card = new Card(cardRequest.getTitle(), cardRequest.getDescription(), position, list, user);
        cardRepository.save(card);

        return ResponseEntity.ok(card);
    }

    @GetMapping("/{cardId}")
    public ResponseEntity<?> getCardById(@PathVariable Long boardId, @PathVariable Long listId, 
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
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Nie masz uprawnien do przegladania tej karty!"));
        }

        return ResponseEntity.ok(card);
    }

    @PutMapping("/{cardId}")
    public ResponseEntity<?> updateCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @PathVariable Long cardId, @Valid @RequestBody Card cardRequest, @RequestParam Long userId) {
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
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko osoby z dostepem do tablicy moga aktualizowac karty!"));
        }

        card.setTitle(cardRequest.getTitle());
        card.setDescription(cardRequest.getDescription());
        if (cardRequest.getPosition() != 0) {
            card.setPosition(cardRequest.getPosition());
        }

        cardRepository.save(card);

        return ResponseEntity.ok(card);
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Long boardId, @PathVariable Long listId, 
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

        // Sprawdz czy uzytkownik jest wlascicielem karty
        if (!card.getOwner().equals(user)) {
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko wlasciciel karty moze ja usunac!"));
        }

        cardRepository.delete(card);

        return ResponseEntity.ok(new MessageResponse("Karta usunieta pomyslnie!"));
    }

    @PostMapping("/{cardId}/members/{userId}")
    public ResponseEntity<?> addMemberToCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                           @PathVariable Long cardId, @PathVariable Long userId) {
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

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik czlonek nie znaleziony!"));
        }

        User memberUser = memberUserOptional.get();

        // Dodaj czlonka do karty
        card.addMember(memberUser);
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Czlonek dodany do karty pomyslnie!"));
    }

    @DeleteMapping("/{cardId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                                @PathVariable Long cardId, @PathVariable Long userId) {
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

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik czlonek nie znaleziony!"));
        }

        User memberUser = memberUserOptional.get();

        // Usun czlonka z karty
        card.removeMember(memberUser);
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Czlonek usuniety z karty pomyslnie!"));
    }

    @PutMapping("/{cardId}/dates")
    public ResponseEntity<?> updateCardDates(@PathVariable Long boardId, @PathVariable Long listId, 
                                           @PathVariable Long cardId, @RequestBody Card cardRequest, @RequestParam Long userId) {
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
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko osoby z dostepem do tablicy moga aktualizowac daty karty!"));
        }

        card.setStartDate(cardRequest.getStartDate());
        card.setDueDate(cardRequest.getDueDate());

        cardRepository.save(card);

        return ResponseEntity.ok(card);
    }

    @PostMapping("/{cardId}/labels")
    public ResponseEntity<?> addLabelToCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                          @PathVariable Long cardId, @Valid @RequestBody LabelRequest labelRequest, @RequestParam Long userId) {
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
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko osoby z dostepem do tablicy moga dodawac etykiety do karty!"));
        }

        // Sprawdz czy istnieje globalna etykieta o tej samej nazwie i kolorze
        List<Label> globalLabels = labelRepository.findByGlobalTrue();
        Label existingLabel = null;

        for (Label label : globalLabels) {
            if (label.getName().equals(labelRequest.getName()) && label.getColor().equals(labelRequest.getColor())) {
                existingLabel = label;
                break;
            }
        }

        if (existingLabel != null) {
            // Utworz kopie globalnej etykiety dla tej karty
            Label newLabel = new Label(existingLabel.getName(), existingLabel.getColor());
            newLabel.setCard(card);
            labelRepository.save(newLabel);
            card.getLabels().add(newLabel);
        } else {
            // Utworz nowa etykiete
            card.addLabel(labelRequest.getName(), labelRequest.getColor());
        }

        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Etykieta dodana do karty pomyslnie!"));
    }

    @PostMapping("/{cardId}/global-labels/{labelId}")
    public ResponseEntity<?> addGlobalLabelToCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                                @PathVariable Long cardId, @PathVariable Long labelId, @RequestParam Long userId) {
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
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko osoby z dostepem do tablicy moga dodawac etykiety do karty!"));
        }

        Optional<Label> labelOptional = labelRepository.findById(labelId);
        if (!labelOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Etykieta nie znaleziona!"));
        }

        Label globalLabel = labelOptional.get();

        // Sprawdz czy etykieta jest globalna
        if (!globalLabel.isGlobal()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Etykieta nie jest globalna!"));
        }

        // Utworz kopie globalnej etykiety dla tej karty
        Label newLabel = new Label(globalLabel.getName(), globalLabel.getColor());
        newLabel.setCard(card);
        labelRepository.save(newLabel);
        card.getLabels().add(newLabel);
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Globalna etykieta dodana do karty pomyslnie!"));
    }

    @DeleteMapping("/{cardId}/labels/{labelId}")
    public ResponseEntity<?> removeLabelFromCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                               @PathVariable Long cardId, @PathVariable Long labelId, @RequestParam Long userId) {
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
            return ResponseEntity.status(403).body(new MessageResponse("Blad: Tylko osoby z dostepem do tablicy moga usuwac etykiety z karty!"));
        }

        Optional<Label> labelOptional = labelRepository.findById(labelId);
        if (!labelOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Etykieta nie znaleziona!"));
        }

        Label label = labelOptional.get();

        // Sprawdz czy etykieta nalezy do okreslonej karty
        if (!label.getCard().getId().equals(cardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Etykieta nie nalezy do okreslonej karty!"));
        }

        card.removeLabel(label);
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Etykieta usunieta z karty pomyslnie!"));
    }
}
