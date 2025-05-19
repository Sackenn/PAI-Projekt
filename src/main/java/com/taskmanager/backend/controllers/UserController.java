package com.taskmanager.backend.controllers;

import com.taskmanager.backend.models.User;
import com.taskmanager.backend.payload.request.EmailUpdateRequest;
import com.taskmanager.backend.payload.request.PasswordUpdateRequest;
import com.taskmanager.backend.payload.request.UsernameUpdateRequest;
import com.taskmanager.backend.payload.response.MessageResponse;
import com.taskmanager.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Kontroler do zarzadzania profilami uzytkownikow
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    /**
     * Pobierz profil uzytkownika po ID
     * @param userId ID uzytkownika
     * @return profil uzytkownika
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();
        // Nie zwracaj hasla
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }

    /**
     * Aktualizuj nazwe uzytkownika
     * @param userId ID uzytkownika do aktualizacji
     * @param usernameRequest nowa nazwa uzytkownika
     * @return komunikat o powodzeniu, jesli aktualizacja sie powiodla
     */
    @PutMapping("/profile/{userId}/username")
    public ResponseEntity<?> updateUsername(@PathVariable Long userId, @Valid @RequestBody UsernameUpdateRequest usernameRequest) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        // Sprawdz czy nazwa uzytkownika jest zmieniana i czy jest juz zajeta
        if (!user.getUsername().equals(usernameRequest.getUsername()) && 
            userRepository.existsByUsername(usernameRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Nazwa uzytkownika jest juz zajeta!"));
        }

        // Aktualizuj nazwe uzytkownika
        user.setUsername(usernameRequest.getUsername());
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Nazwa uzytkownika zaktualizowana pomyslnie!"));
    }

    /**
     * Aktualizuj email uzytkownika
     * @param userId ID uzytkownika do aktualizacji
     * @param emailRequest nowy email
     * @return komunikat o powodzeniu, jesli aktualizacja sie powiodla
     */
    @PutMapping("/profile/{userId}/email")
    public ResponseEntity<?> updateEmail(@PathVariable Long userId, @Valid @RequestBody EmailUpdateRequest emailRequest) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        // Sprawdz czy email jest zmieniany i czy jest juz w uzyciu
        if (!user.getEmail().equals(emailRequest.getEmail()) && 
            userRepository.existsByEmail(emailRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Email jest juz w uzyciu!"));
        }

        // Aktualizuj email
        user.setEmail(emailRequest.getEmail());
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Email uzytkownika zaktualizowany pomyslnie!"));
    }

    /**
     * Aktualizuj haslo uzytkownika
     * @param userId ID uzytkownika do aktualizacji
     * @param passwordRequest aktualne i nowe haslo
     * @return komunikat o powodzeniu, jesli aktualizacja sie powiodla
     */
    @PutMapping("/profile/{userId}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long userId, @Valid @RequestBody PasswordUpdateRequest passwordRequest) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        // Sprawdz czy aktualne haslo jest poprawne
        if (!user.getPassword().equals(passwordRequest.getCurrentPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Aktualne haslo jest niepoprawne!"));
        }

        // Aktualizuj haslo (bez szyfrowania dla uproszczenia)
        user.setPassword(passwordRequest.getPassword());
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Haslo uzytkownika zaktualizowane pomyslnie!"));
    }

    /**
     * Pobierz liste wszystkich uzytkownikow
     * @return lista uzytkownikow z podstawowymi informacjami (id, username)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();

        // Mapuj uzytkownikow do prostszej struktury, bez hasel i innych wrażliwych danych
        List<Object> simplifiedUsers = users.stream()
            .map(user -> {
                return new Object() {
                    public final Long id = user.getId();
                    public final String username = user.getUsername();
                };
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(simplifiedUsers);
    }
}
