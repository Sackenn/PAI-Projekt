package com.taskmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Board> boards = new HashSet<>();

    @ManyToMany(mappedBy = "members")
    @JsonIgnore
    private Set<Board> memberOfBoards = new HashSet<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "list-owner")
    private Set<BoardList> ownedLists = new HashSet<>();

    @ManyToMany(mappedBy = "members")
    @JsonIgnore
    private Set<BoardList> memberOfLists = new HashSet<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "card-owner")
    private Set<Card> ownedCards = new HashSet<>();

    @ManyToMany(mappedBy = "members")
    @JsonIgnore
    private Set<Card> memberOfCards = new HashSet<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "task-owner")
    private Set<Task> ownedTasks = new HashSet<>();

    @ManyToMany(mappedBy = "members")
    @JsonIgnore
    private Set<Task> memberOfTasks = new HashSet<>();

    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Board> getBoards() {
        return boards;
    }

    public void setBoards(Set<Board> boards) {
        this.boards = boards;
    }

    public Set<Board> getMemberOfBoards() {
        return memberOfBoards;
    }

    public void setMemberOfBoards(Set<Board> memberOfBoards) {
        this.memberOfBoards = memberOfBoards;
    }

    public Set<BoardList> getOwnedLists() {
        return ownedLists;
    }

    public void setOwnedLists(Set<BoardList> ownedLists) {
        this.ownedLists = ownedLists;
    }

    public Set<BoardList> getMemberOfLists() {
        return memberOfLists;
    }

    public void setMemberOfLists(Set<BoardList> memberOfLists) {
        this.memberOfLists = memberOfLists;
    }

    public Set<Card> getOwnedCards() {
        return ownedCards;
    }

    public void setOwnedCards(Set<Card> ownedCards) {
        this.ownedCards = ownedCards;
    }

    public Set<Card> getMemberOfCards() {
        return memberOfCards;
    }

    public void setMemberOfCards(Set<Card> memberOfCards) {
        this.memberOfCards = memberOfCards;
    }

    public Set<Task> getOwnedTasks() {
        return ownedTasks;
    }

    public void setOwnedTasks(Set<Task> ownedTasks) {
        this.ownedTasks = ownedTasks;
    }

    public Set<Task> getMemberOfTasks() {
        return memberOfTasks;
    }

    public void setMemberOfTasks(Set<Task> memberOfTasks) {
        this.memberOfTasks = memberOfTasks;
    }
}
