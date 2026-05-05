package com.cdrn.backend.repository;

import com.cdrn.backend.model.Role;
import com.cdrn.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find a user by their unique phone number */
    Optional<User> findByPhone(String phone);

    /** Find all users with a given role (e.g., VOLUNTEER) */
    List<User> findByRole(Role role);
}
