package com.aircore.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class LoginLogoutLogsDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "login_logout_logs_id", nullable = false)
    private LoginLogoutLogs loginLogoutLogs;
    
    @Temporal(TemporalType.TIMESTAMP)
	@Column(name = "login_time", nullable = true)
	private Date loginTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "logout_time", nullable = true)
	private Date logoutTime;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_at", nullable = false, updatable = false)
	private Date createdAt;

}
