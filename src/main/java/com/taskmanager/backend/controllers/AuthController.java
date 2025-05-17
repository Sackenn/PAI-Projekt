package com.taskmanager.backend.controllers;

import com.taskmanager.backend.models.User;
import com.taskmanager.backend.payload.request.LoginRequest;
import com.taskmanager.backend.payload.request.SignupRequest;
import com.taskmanager.backend.payload.response.MessageResponse;
import com.taskmanager.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Kontroler do obslugi uwierzytelniania uzytkownikow
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    UserRepository userRepository;

    /**
     * Uwierzytelnianie uzytkownika
     * @param loginRequest dane logowania
     * @return informacje o uzytkowniku, jesli uwierzytelnianie jest udane
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                // Utworz bezpieczne ciasteczko z identyfikatorem uzytkownika
                ResponseCookie cookie = ResponseCookie.from("userId", user.getId().toString())
                    .httpOnly(false)  // Zezwol na dostep JavaScript dla naszego frontendu
                    .secure(false)    // Ustaw na true w produkcji z HTTPS
                    .path("/")
                    .maxAge(24 * 60 * 60) // 24 godziny
                    .build();

                // Utworz tresc odpowiedzi
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                response.put("message", "Logowanie udane");

                // Zwroc odpowiedz z ciasteczkiem
                return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
            }
        }

        return ResponseEntity.badRequest().body(new MessageResponse("Blad: Nieprawidlowa nazwa uzytkownika lub haslo"));
    }

    /**
     * Rejestracja nowego uzytkownika
     * @param signUpRequest dane rejestracyjne uzytkownika
     * @return komunikat o powodzeniu, jesli rejestracja jest udana
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Blad: Nazwa uzytkownika jest juz zajeta!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Blad: Email jest juz w uzyciu!"));
        }

        User user = new User(signUpRequest.getUsername(), 
                             signUpRequest.getEmail(),
                             signUpRequest.getPassword());

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Uzytkownik zarejestrowany pomyslnie!"));
    }

    /**
     * Wylogowanie uzytkownika poprzez wyczyszczenie ciasteczka userId
     * @return komunikat o powodzeniu
     */
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        // Wyczysc ciasteczko userId
        ResponseCookie cookie = ResponseCookie.from("userId", "")
            .httpOnly(false)
            .secure(false)
            .path("/")
            .maxAge(0) // Wygasnie natychmiast
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(new MessageResponse("Uzytkownik wylogowany pomyslnie!"));
    }
}
