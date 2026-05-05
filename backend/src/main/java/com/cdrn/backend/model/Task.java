package com.cdrn.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "volunteer_id")
    private User volunteer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_id")
    private Incident incident;

    private String status = "ASSIGNED";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Task() {}
    public Task(Long id, User volunteer, Incident incident, String status, LocalDateTime createdAt) {
        this.id = id; this.volunteer = volunteer; this.incident = incident;
        this.status = status; this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getVolunteer() { return volunteer; }
    public void setVolunteer(User volunteer) { this.volunteer = volunteer; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User volunteer;
        private Incident incident;
        private String status = "ASSIGNED";
        private LocalDateTime createdAt = LocalDateTime.now();
        public Builder id(Long id) { this.id = id; return this; }
        public Builder volunteer(User volunteer) { this.volunteer = volunteer; return this; }
        public Builder incident(Incident incident) { this.incident = incident; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Task build() {
            Task t = new Task();
            t.id = id; t.volunteer = volunteer; t.incident = incident;
            t.status = status; t.createdAt = createdAt;
            return t;
        }
    }
}
