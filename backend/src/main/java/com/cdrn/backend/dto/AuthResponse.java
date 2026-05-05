package com.cdrn.backend.dto;

import com.cdrn.backend.model.User;

public class AuthResponse {
    private String token;
    private User user;

    public AuthResponse() {}
    public AuthResponse(String token, User user) { this.token = token; this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private User user;
        public Builder token(String token) { this.token = token; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public AuthResponse build() { return new AuthResponse(token, user); }
    }
}
