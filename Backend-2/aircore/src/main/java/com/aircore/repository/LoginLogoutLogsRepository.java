package com.aircore.repository;

import java.util.Date;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aircore.entity.LoginLogoutLogs;

@Repository
public interface LoginLogoutLogsRepository extends JpaRepository<LoginLogoutLogs, Long> {
	
	Optional<LoginLogoutLogs> findByUserIdAndDate(Long userId, Date date);

	LoginLogoutLogs findTopByUserIdOrderByCreatedAtDesc(Long userId);
	
}
