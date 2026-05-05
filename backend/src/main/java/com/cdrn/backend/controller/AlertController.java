package com.cdrn.backend.controller;

import com.cdrn.backend.dto.AlertRequest;
import com.cdrn.backend.model.Alert;
import com.cdrn.backend.model.User;
import com.cdrn.backend.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alert")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    @Autowired
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    /**
     * Send a new broadcast alert.
     * Only AUTHORITY role users can send alerts.
     * POST /api/alert/send
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendAlert(
            @RequestBody AlertRequest request,
            @AuthenticationPrincipal User user) {
        // Enforce AUTHORITY role
        if (!user.getRole().name().equals("AUTHORITY")) {
            return ResponseEntity.status(403).body("Only AUTHORITY users can send alerts");
        }
        Alert alert = alertService.sendAlert(request.getMessage());
        return ResponseEntity.ok(alert);
    }

    /**
     * Get all alerts.
     * GET /api/alert/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }
}
