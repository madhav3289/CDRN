package com.cdrn.backend.controller;

import com.cdrn.backend.model.Role;
import com.cdrn.backend.model.User;
import com.cdrn.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get all users with the VOLUNTEER role.
     * GET /api/users/volunteers
     */
    @GetMapping("/volunteers")
    public ResponseEntity<List<User>> getVolunteers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.VOLUNTEER));
    }

    /**
     * Update a user's role.
     * PUT /api/users/{id}/role
     */
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        String roleName = body.get("role");
        try {
            Role role = Role.valueOf(roleName);
            user.setRole(role);
            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role: " + roleName
                    + ". Valid roles are: CITIZEN, VOLUNTEER, AUTHORITY");
        }
    }
}
