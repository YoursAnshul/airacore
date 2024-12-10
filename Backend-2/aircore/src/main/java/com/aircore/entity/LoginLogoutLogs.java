package com.aircore.entity;

import java.util.Date;
import java.util.List;

import com.aircore.utility.Enumeration.CurrentStatus;
import com.aircore.utility.Enumeration.LoginType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class LoginLogoutLogs {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_at", nullable = false, updatable = false)
	private Date createdAt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "login_time", nullable = true)
	private Date loginTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "logout_time", nullable = true)
	private Date logoutTime;

	@Temporal(TemporalType.DATE)
	@Column(name = "date", nullable = false)
	private Date date;

	@Column(name = "user_id", nullable = false)
	private Long userId;

	@Enumerated(EnumType.STRING)
	private LoginType loginType;
	
	@Enumerated(EnumType.STRING)
	private CurrentStatus currentStatus;

    @OneToMany(mappedBy = "loginLogoutLogs", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoginLogoutLogsDetails> details;
    
}
