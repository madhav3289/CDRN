package com.cdrn.backend.service;

import com.cdrn.backend.model.Alert;
import com.cdrn.backend.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public AlertService(AlertRepository alertRepository, SimpMessagingTemplate messagingTemplate) {
        this.alertRepository = alertRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Create a new alert and broadcast it to all WebSocket subscribers.
     */
    public Alert sendAlert(String message) {
        Alert alert = Alert.builder()
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();

        Alert saved = alertRepository.save(alert);

        // Broadcast alert to the /topic/alerts channel
        messagingTemplate.convertAndSend("/topic/alerts", saved);

        return saved;
    }

    /** Retrieve all alerts */
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }
}
