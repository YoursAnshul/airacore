package com.aircore.response;

import java.util.Date;

import com.aircore.utility.Enumeration.CurrentStatus;
import com.aircore.utility.Enumeration.LoginType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginLogoutLogsResponse {
    private Long id;
    private String username;
    private CurrentStatus currentStatus;
    private Date loginTime;
    private Date logoutTime;
    private Date date;
    private LoginType loginType;

    public LoginLogoutLogsResponse(Long id, String username, CurrentStatus currentStatus, Date loginTime, Date logoutTime, Date date, LoginType loginType) {
        this.id = id;
        this.username = username;
        this.currentStatus = currentStatus;
        this.loginTime = loginTime;
        this.logoutTime = logoutTime;
        this.date = date;
        this.loginType = loginType;
    }

}

