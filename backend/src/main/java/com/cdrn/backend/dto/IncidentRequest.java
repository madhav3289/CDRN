package com.cdrn.backend.dto;

public class IncidentRequest {
    private String type;
    private String description;
    private Double latitude;
    private Double longitude;

    public IncidentRequest() {}
    public IncidentRequest(String type, String description, Double latitude, Double longitude) {
        this.type = type; this.description = description;
        this.latitude = latitude; this.longitude = longitude;
    }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
