package com.cdrn.backend.repository;

import com.cdrn.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /** Find all tasks assigned to a specific volunteer */
    List<Task> findByVolunteerId(Long volunteerId);
}
