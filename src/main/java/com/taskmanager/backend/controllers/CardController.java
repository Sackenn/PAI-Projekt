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
    public ResponseEntity<?> getListCards(@PathVariable Long boardId, @PathVariable Long listId) {
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

        // Sprawdź, czy lista należy do określonej tablicy
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        List<Card> cards = cardRepository.findByListOrderByPosition(list);

        return ResponseEntity.ok(cards);
    }

    @PostMapping
    public ResponseEntity<?> createCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @Valid @RequestBody Card cardRequest) {
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

        // Sprawdź, czy lista należy do określonej tablicy
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        // Pobierz najwyższą wartość pozycji
        List<Card> existingCards = cardRepository.findByListOrderByPosition(list);
        int position = 0;
        if (!existingCards.isEmpty()) {
            position = existingCards.get(existingCards.size() - 1).getPosition() + 1;
        }

        Card card = new Card(cardRequest.getTitle(), cardRequest.getDescription(), position, list);
        cardRepository.save(card);

        return ResponseEntity.ok(card);
    }

    @GetMapping("/{cardId}")
    public ResponseEntity<?> getCardById(@PathVariable Long boardId, @PathVariable Long listId, 
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

        // Sprawdź, czy lista należy do określonej tablicy
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card not found!"));
        }

        Card card = cardOptional.get();

        // Sprawdź, czy karta należy do określonej listy
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card does not belong to the specified list!"));
        }

        return ResponseEntity.ok(card);
    }

    @PutMapping("/{cardId}")
    public ResponseEntity<?> updateCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                       @PathVariable Long cardId, @Valid @RequestBody Card cardRequest) {
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

        // Sprawdź, czy lista należy do określonej tablicy
        if (!list.getBoard().getId().equals(boardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: List does not belong to the specified board!"));
        }

        Optional<Card> cardOptional = cardRepository.findById(cardId);
        if (!cardOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card not found!"));
        }

        Card card = cardOptional.get();

        // Sprawdź, czy karta należy do określonej listy
        if (!card.getList().getId().equals(listId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card does not belong to the specified list!"));
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

        cardRepository.delete(card);

        return ResponseEntity.ok(new MessageResponse("Card deleted successfully!"));
    }

    @PostMapping("/{cardId}/members/{userId}")
    public ResponseEntity<?> addMemberToCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                           @PathVariable Long cardId, @PathVariable Long userId) {
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

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Member user not found!"));
        }

        User memberUser = memberUserOptional.get();

        // Add member to card
        card.addMember(memberUser);
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Member added to card successfully!"));
    }

    @DeleteMapping("/{cardId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                                @PathVariable Long cardId, @PathVariable Long userId) {
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

        Optional<User> memberUserOptional = userRepository.findById(userId);
        if (!memberUserOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Member user not found!"));
        }

        User memberUser = memberUserOptional.get();

        // Remove member from card
        card.removeMember(memberUser);
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Member removed from card successfully!"));
    }

    @PutMapping("/{cardId}/dates")
    public ResponseEntity<?> updateCardDates(@PathVariable Long boardId, @PathVariable Long listId, 
                                           @PathVariable Long cardId, @RequestBody Card cardRequest) {
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

        card.setStartDate(cardRequest.getStartDate());
        card.setDueDate(cardRequest.getDueDate());

        cardRepository.save(card);

        return ResponseEntity.ok(card);
    }

    @PostMapping("/{cardId}/labels")
    public ResponseEntity<?> addLabelToCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                          @PathVariable Long cardId, @Valid @RequestBody LabelRequest labelRequest) {
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

        card.addLabel(labelRequest.getName(), labelRequest.getColor());
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Label added to card successfully!"));
    }

    @DeleteMapping("/{cardId}/labels/{labelId}")
    public ResponseEntity<?> removeLabelFromCard(@PathVariable Long boardId, @PathVariable Long listId, 
                                               @PathVariable Long cardId, @PathVariable Long labelId) {
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

        Optional<Label> labelOptional = labelRepository.findById(labelId);
        if (!labelOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Label not found!"));
        }

        Label label = labelOptional.get();

        // Check if label belongs to the specified card
        if (!label.getCard().getId().equals(cardId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Label does not belong to the specified card!"));
        }

        card.removeLabel(label);
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Label removed from card successfully!"));
    }
}
