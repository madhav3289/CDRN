package com.cdrn.backend.controller;

import com.cdrn.backend.dto.IncidentRequest;
import com.cdrn.backend.model.Incident;
import com.cdrn.backend.model.User;
import com.cdrn.backend.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incident")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;

    @Autowired
    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    /**
     * Report a new incident. The reporting user is extracted from the JWT.
     * Broadcasts the incident to /topic/incidents via WebSocket.
     * POST /api/incident/report
     */
    @PostMapping("/report")
    public ResponseEntity<Incident> reportIncident(
            @RequestBody IncidentRequest request,
            @AuthenticationPrincipal User user) {
        Incident incident = incidentService.reportIncident(request, user);
        return ResponseEntity.ok(incident);
    }

    /**
     * Get all reported incidents.
     * GET /api/incident/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }
}
