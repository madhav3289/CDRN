package com.cdrn.backend.dto;

public class OtpVerifyRequest {
    private String phone;
    private String otp;
    private String name;
    private String role;

    public OtpVerifyRequest() {}
    public OtpVerifyRequest(String phone, String otp, String name, String role) {
        this.phone = phone; this.otp = otp; this.name = name; this.role = role;
    }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
