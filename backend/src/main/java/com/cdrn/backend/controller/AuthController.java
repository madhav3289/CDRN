package com.cdrn.backend.controller;

import com.cdrn.backend.dto.AuthResponse;
import com.cdrn.backend.dto.OtpRequest;
import com.cdrn.backend.dto.OtpVerifyRequest;
import com.cdrn.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Send OTP to the given phone number.
     * POST /api/auth/send-otp
     */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        String message = authService.sendOtp(request.getPhone());
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * Verify the OTP and return a JWT token with user details.
     * Creates a new user with CITIZEN role if one doesn't exist for this phone.
     * POST /api/auth/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtp(request.getPhone(), request.getOtp(), request.getName(), request.getRole());
        return ResponseEntity.ok(response);
    }
}
