package com.taskmanager.backend.controllers;

import com.taskmanager.backend.models.User;
import com.taskmanager.backend.payload.response.MessageResponse;
import com.taskmanager.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

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
     * Aktualizuj profil uzytkownika
     * @param userId ID uzytkownika do aktualizacji
     * @param userUpdate zaktualizowane dane uzytkownika
     * @return komunikat o powodzeniu, jesli aktualizacja sie powiodla
     */
    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @Valid @RequestBody User userUpdate) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Uzytkownik nie znaleziony!"));
        }

        User user = userOptional.get();

        // Sprawdz czy nazwa uzytkownika jest zmieniana i czy jest juz zajeta
        if (!user.getUsername().equals(userUpdate.getUsername()) && 
            userRepository.existsByUsername(userUpdate.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Nazwa uzytkownika jest juz zajeta!"));
        }

        // Sprawdz czy email jest zmieniany i czy jest juz w uzyciu
        if (!user.getEmail().equals(userUpdate.getEmail()) && 
            userRepository.existsByEmail(userUpdate.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Blad: Email jest juz w uzyciu!"));
        }

        // Aktualizuj pola uzytkownika
        user.setUsername(userUpdate.getUsername());
        user.setEmail(userUpdate.getEmail());

        // Aktualizuj haslo jesli podane (bez szyfrowania dla uproszczenia)
        if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
            user.setPassword(userUpdate.getPassword());
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Profil uzytkownika zaktualizowany pomyslnie!"));
    }
}
