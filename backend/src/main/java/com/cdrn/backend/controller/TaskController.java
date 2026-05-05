package com.cdrn.backend.controller;

import com.cdrn.backend.dto.TaskAssignRequest;
import com.cdrn.backend.dto.TaskUpdateRequest;
import com.cdrn.backend.model.Task;
import com.cdrn.backend.model.User;
import com.cdrn.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Assign a task to a volunteer for an incident.
     * Only AUTHORITY role users can assign tasks.
     * POST /api/task/assign
     */
    @PostMapping("/assign")
    public ResponseEntity<?> assignTask(
            @RequestBody TaskAssignRequest request,
            @AuthenticationPrincipal User user) {
        // Enforce AUTHORITY role
        if (!user.getRole().name().equals("AUTHORITY")) {
            return ResponseEntity.status(403).body("Only AUTHORITY users can assign tasks");
        }
        Task task = taskService.assignTask(request.getVolunteerId(), request.getIncidentId());
        return ResponseEntity.ok(task);
    }

    /**
     * Update the status of a task.
     * Only VOLUNTEER role users can update task status.
     * PUT /api/task/update
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateTask(
            @RequestBody TaskUpdateRequest request,
            @AuthenticationPrincipal User user) {
        // Enforce VOLUNTEER role
        if (!user.getRole().name().equals("VOLUNTEER")) {
            return ResponseEntity.status(403).body("Only VOLUNTEER users can update tasks");
        }
        Task task = taskService.updateTaskStatus(request.getTaskId(), request.getStatus());
        return ResponseEntity.ok(task);
    }

    /**
     * Get tasks assigned to the currently authenticated volunteer.
     * GET /api/task/my
     */
    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.getTasksByVolunteer(user.getId()));
    }

    /**
     * Get all tasks assigned to a specific volunteer.
     * GET /api/task/volunteer/{volunteerId}
     */
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<Task>> getVolunteerTasks(@PathVariable Long volunteerId) {
        return ResponseEntity.ok(taskService.getTasksByVolunteer(volunteerId));
    }
}
