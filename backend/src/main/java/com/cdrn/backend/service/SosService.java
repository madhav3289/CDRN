package com.cdrn.backend.service;

import com.cdrn.backend.dto.SosRequestDto;
import com.cdrn.backend.model.SosRequest;
import com.cdrn.backend.model.User;
import com.cdrn.backend.repository.SosRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SosService {

    private final SosRequestRepository sosRequestRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public SosService(SosRequestRepository sosRequestRepository, SimpMessagingTemplate messagingTemplate) {
        this.sosRequestRepository = sosRequestRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Create a new SOS request and broadcast it as an alert.
     */
    public SosRequest createSosRequest(SosRequestDto dto, User user) {
        SosRequest sosRequest = SosRequest.builder()
                .user(user)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        SosRequest saved = sosRequestRepository.save(sosRequest);

        // Broadcast SOS to the alerts topic so all subscribers are notified
        messagingTemplate.convertAndSend("/topic/alerts", saved);

        return saved;
    }

    /**
     * Get all SOS requests.
     */
    public List<SosRequest> getAllSosRequests() {
        return sosRequestRepository.findAll();
    }
}
