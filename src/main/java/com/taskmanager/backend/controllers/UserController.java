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
 * Controller for managing user profiles
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    /**
     * Get a user profile by ID
     * @param userId the ID of the user
     * @return the user profile
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        User user = userOptional.get();
        // Don't return the password
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }

    /**
     * Update a user profile
     * @param userId the ID of the user to update
     * @param userUpdate the updated user data
     * @return success message if update is successful
     */
    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @Valid @RequestBody User userUpdate) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        User user = userOptional.get();

        // Check if username is being changed and if it's already taken
        if (!user.getUsername().equals(userUpdate.getUsername()) && 
            userRepository.existsByUsername(userUpdate.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is being changed and if it's already in use
        if (!user.getEmail().equals(userUpdate.getEmail()) && 
            userRepository.existsByEmail(userUpdate.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Update user fields
        user.setUsername(userUpdate.getUsername());
        user.setEmail(userUpdate.getEmail());

        // Update password if provided (no encryption for simplicity)
        if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
            user.setPassword(userUpdate.getPassword());
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User profile updated successfully!"));
    }
}
