package com.aircore.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aircore.entity.LoginLogoutLogs;
import com.aircore.entity.LoginLogoutLogsDetails;
import com.aircore.repository.LoginLogoutLogsDetailsRepository;
import com.aircore.repository.LoginLogoutLogsRepository;
import com.aircore.response.LoginStatusResponse;
import com.aircore.utility.Enumeration.CurrentStatus;
import com.aircore.utility.Enumeration.LoginType;

@Service
public class LoginLogoutLogsService {

	@Autowired
	private LoginLogoutLogsRepository loginLogoutLogsRepository;

	@Autowired
	private LoginLogoutLogsDetailsRepository loginLogoutLogsDetailsRepository;

	public void login(Long userId, String loginType) {
		Date currentDate = new Date();
		Optional<LoginLogoutLogs> existingLog = loginLogoutLogsRepository.findByUserIdAndDate(userId, currentDate);

		LoginLogoutLogs log;
		if (existingLog.isPresent()) {
			log = existingLog.get();
			log.setLogoutTime(null);
			log.setCurrentStatus(CurrentStatus.LOGIN);
		} else {
			log = new LoginLogoutLogs();
			log.setUserId(userId);
			log.setDate(currentDate);
			log.setLoginTime(new Date());
			log.setCurrentStatus(CurrentStatus.LOGIN);
			log.setLoginType(LoginType.valueOf(loginType));
			log.setCreatedAt(new Date());
		}

		loginLogoutLogsRepository.save(log);
		LoginLogoutLogsDetails details = new LoginLogoutLogsDetails();
		details.setLoginLogoutLogs(log);
		details.setLoginTime(new Date());
		details.setCreatedAt(new Date());
		loginLogoutLogsDetailsRepository.save(details);
	}

	public void logout(Long logId) {
		Date currentDate = new Date();
		Optional<LoginLogoutLogs> existingLog = loginLogoutLogsRepository.findById(logId);

		if (existingLog.isPresent()) {
			LoginLogoutLogs log = existingLog.get();
			log.setLogoutTime(currentDate);
			log.setCurrentStatus(CurrentStatus.LOGOUT);
			loginLogoutLogsRepository.save(log);

			Optional<LoginLogoutLogsDetails> recentDetail = loginLogoutLogsDetailsRepository
					.findTopByLoginLogoutLogsIdOrderByCreatedAtDesc(log.getId());

			if (recentDetail.isPresent()) {
				LoginLogoutLogsDetails details = recentDetail.get();
				details.setLogoutTime(currentDate);
				loginLogoutLogsDetailsRepository.save(details);
			}
		} else {
			throw new IllegalArgumentException("Log not found for ID: " + logId);
		}
	}
	
	public LoginStatusResponse getUserLoginStatus(Long userId) {
	    LoginLogoutLogs lastLog = loginLogoutLogsRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
	    if (lastLog == null || lastLog.getLogoutTime() != null) {
	        return new LoginStatusResponse(false, null);  // User is logged out
	    }
	    return new LoginStatusResponse(true, lastLog.getId());  // User is logged in, return loginId
	}

}
