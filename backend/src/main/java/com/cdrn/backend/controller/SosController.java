package com.cdrn.backend.controller;

import com.cdrn.backend.dto.SosRequestDto;
import com.cdrn.backend.model.SosRequest;
import com.cdrn.backend.model.User;
import com.cdrn.backend.service.SosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos")
@CrossOrigin(origins = "*")
public class SosController {

    private final SosService sosService;

    @Autowired
    public SosController(SosService sosService) {
        this.sosService = sosService;
    }

    /**
     * Create a new SOS request. The user is extracted from the JWT.
     * Broadcasts the SOS to /topic/alerts via WebSocket.
     * POST /api/sos/request
     */
    @PostMapping("/request")
    public ResponseEntity<SosRequest> createSosRequest(
            @RequestBody SosRequestDto request,
            @AuthenticationPrincipal User user) {
        SosRequest sosRequest = sosService.createSosRequest(request, user);
        return ResponseEntity.ok(sosRequest);
    }

    /**
     * Get all SOS requests.
     * GET /api/sos/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<SosRequest>> getAllSosRequests() {
        return ResponseEntity.ok(sosService.getAllSosRequests());
    }
}
