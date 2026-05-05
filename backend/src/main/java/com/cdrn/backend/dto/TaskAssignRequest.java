package com.cdrn.backend.dto;

public class TaskAssignRequest {
    private Long volunteerId;
    private Long incidentId;

    public TaskAssignRequest() {}
    public TaskAssignRequest(Long volunteerId, Long incidentId) {
        this.volunteerId = volunteerId; this.incidentId = incidentId;
    }
    public Long getVolunteerId() { return volunteerId; }
    public void setVolunteerId(Long volunteerId) { this.volunteerId = volunteerId; }
    public Long getIncidentId() { return incidentId; }
    public void setIncidentId(Long incidentId) { this.incidentId = incidentId; }
}
