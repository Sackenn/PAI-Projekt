package com.taskmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "board_lists")
public class BoardList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    private int position;

    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)
    @JsonBackReference
    private Board board;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonBackReference(value = "list-owner")
    private User owner;

    @ManyToMany
    @JoinTable(
        name = "list_members",
        joinColumns = @JoinColumn(name = "list_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Card> cards = new ArrayList<>();

    public BoardList() {
    }

    public BoardList(String name, int position, Board board, User owner) {
        this.name = name;
        this.position = position;
        this.board = board;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Set<User> getMembers() {
        return members;
    }

    public void setMembers(Set<User> members) {
        this.members = members;
    }

    // Metody pomocnicze
    public void addCard(Card card) {
        cards.add(card);
        card.setList(this);
    }

    public void removeCard(Card card) {
        cards.remove(card);
        card.setList(null);
    }

    public void addMember(User user) {
        members.add(user);
    }

    public void removeMember(User user) {
        members.remove(user);
    }
}
