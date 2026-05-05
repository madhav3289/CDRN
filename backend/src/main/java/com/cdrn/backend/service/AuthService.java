package com.cdrn.backend.service;

import com.cdrn.backend.config.JwtUtil;
import com.cdrn.backend.dto.AuthResponse;
import com.cdrn.backend.model.Role;
import com.cdrn.backend.model.User;
import com.cdrn.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /** In-memory OTP store: phone -> otp */
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    /**
     * Generate and store an OTP for the given phone number.
     * Always generates "123456" for simplicity.
     */
    public String sendOtp(String phone) {
        String otp = "123456";
        otpStore.put(phone, otp);
        return "OTP sent";
    }

    /**
     * Verify the OTP for the given phone number.
     * If the user doesn't exist, creates a new user with CITIZEN role.
     * Returns a JWT token and the user details.
     */
    public AuthResponse verifyOtp(String phone, String otp, String name, String roleName) {
        String storedOtp = otpStore.get(phone);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        otpStore.remove(phone);

        User user = userRepository.findByPhone(phone)
                .orElseGet(() -> {
                    String userName = (name != null && !name.isBlank()) ? name : "User_" + phone;
                    Role role = Role.CITIZEN;
                    if (roleName != null) {
                        try { role = Role.valueOf(roleName.toUpperCase()); } catch (IllegalArgumentException ignored) {}
                    }
                    User newUser = User.builder()
                            .phone(phone)
                            .name(userName)
                            .role(role)
                            .build();
                    return userRepository.save(newUser);
                });

        // Generate JWT token with user ID as subject
        String token = jwtUtil.generateToken(user.getId());

        return AuthResponse.builder()
                .token(token)
                .user(user)
                .build();
    }
}
