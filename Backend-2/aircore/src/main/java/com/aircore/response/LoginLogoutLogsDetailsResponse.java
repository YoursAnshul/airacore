package com.aircore.response;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginLogoutLogsDetailsResponse {
    private Date loginTime;
    private Date logoutTime;

    public LoginLogoutLogsDetailsResponse(Date loginTime, Date logoutTime) {
        this.loginTime = loginTime;
        this.logoutTime = logoutTime;
    }
}
