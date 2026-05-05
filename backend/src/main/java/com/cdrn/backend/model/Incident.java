package com.cdrn.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double latitude;
    private Double longitude;
    private String status = "REPORTED";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Incident() {}
    public Incident(Long id, String type, String description, Double latitude, Double longitude,
                    String status, User reportedBy, LocalDateTime createdAt) {
        this.id = id; this.type = type; this.description = description;
        this.latitude = latitude; this.longitude = longitude; this.status = status;
        this.reportedBy = reportedBy; this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public User getReportedBy() { return reportedBy; }
    public void setReportedBy(User reportedBy) { this.reportedBy = reportedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String type;
        private String description;
        private Double latitude;
        private Double longitude;
        private String status = "REPORTED";
        private User reportedBy;
        private LocalDateTime createdAt = LocalDateTime.now();
        public Builder id(Long id) { this.id = id; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder latitude(Double latitude) { this.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { this.longitude = longitude; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder reportedBy(User reportedBy) { this.reportedBy = reportedBy; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Incident build() {
            Incident i = new Incident();
            i.id = id; i.type = type; i.description = description;
            i.latitude = latitude; i.longitude = longitude; i.status = status;
            i.reportedBy = reportedBy; i.createdAt = createdAt;
            return i;
        }
    }
}
