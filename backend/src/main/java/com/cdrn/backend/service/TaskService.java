package com.cdrn.backend.service;

import com.cdrn.backend.model.Incident;
import com.cdrn.backend.model.Task;
import com.cdrn.backend.model.User;
import com.cdrn.backend.repository.IncidentRepository;
import com.cdrn.backend.repository.TaskRepository;
import com.cdrn.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final IncidentRepository incidentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository,
                       IncidentRepository incidentRepository, SimpMessagingTemplate messagingTemplate) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.incidentRepository = incidentRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Assign a task to a volunteer for a specific incident.
     * Only AUTHORITY users should call this (enforced at controller level).
     */
    public Task assignTask(Long volunteerId, Long incidentId) {
        User volunteer = userRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found with id: " + volunteerId));

        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + incidentId));

        Task task = Task.builder()
                .volunteer(volunteer)
                .incident(incident)
                .status("ASSIGNED")
                .createdAt(LocalDateTime.now())
                .build();

        Task saved = taskRepository.save(task);

        // Broadcast task assignment to subscribers
        messagingTemplate.convertAndSend("/topic/tasks", saved);

        return saved;
    }

    /**
     * Update the status of an existing task.
     * Only VOLUNTEER users should call this (enforced at controller level).
     */
    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setStatus(status);
        Task saved = taskRepository.save(task);

        // Broadcast task update to subscribers
        messagingTemplate.convertAndSend("/topic/tasks", saved);

        return saved;
    }

    /** Get all tasks assigned to a specific volunteer */
    public List<Task> getTasksByVolunteer(Long volunteerId) {
        return taskRepository.findByVolunteerId(volunteerId);
    }
}
