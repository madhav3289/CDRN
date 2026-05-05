package com.cdrn.backend.dto;

public class AlertRequest {
    private String message;

    public AlertRequest() {}
    public AlertRequest(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
