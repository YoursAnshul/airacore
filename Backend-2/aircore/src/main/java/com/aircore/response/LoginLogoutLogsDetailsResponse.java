package com.aircore.response;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginLogoutLogsDetailsResponse {
    private Date loginTime;
    private Date logoutTime;
    private String description;

    public LoginLogoutLogsDetailsResponse(Date loginTime, Date logoutTime, String description) {
        this.loginTime = loginTime;
        this.logoutTime = logoutTime;
        this.description = description;
    }
}
