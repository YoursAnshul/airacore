package com.aircore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aircore.entity.LoginLogoutLogsDetails;

@Repository
public interface LoginLogoutLogsDetailsRepository extends JpaRepository<LoginLogoutLogsDetails, Long> {
	
    Optional<LoginLogoutLogsDetails> findTopByLoginLogoutLogsIdOrderByCreatedAtDesc(Long loginLogoutLogsId);
    
}
