package com.cdrn.backend.service;

import com.cdrn.backend.dto.IncidentRequest;
import com.cdrn.backend.model.Incident;
import com.cdrn.backend.model.User;
import com.cdrn.backend.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public IncidentService(IncidentRepository incidentRepository, SimpMessagingTemplate messagingTemplate) {
        this.incidentRepository = incidentRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Report a new incident and broadcast it to all subscribers.
     */
    public Incident reportIncident(IncidentRequest request, User reportedBy) {
        Incident incident = Incident.builder()
                .type(request.getType())
                .description(request.getDescription())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status("REPORTED")
                .reportedBy(reportedBy)
                .createdAt(LocalDateTime.now())
                .build();

        Incident saved = incidentRepository.save(incident);

        // Broadcast the new incident to all WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/incidents", saved);

        return saved;
    }

    /** Retrieve all incidents */
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }
}
