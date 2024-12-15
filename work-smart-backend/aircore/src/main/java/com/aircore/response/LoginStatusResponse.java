package com.aircore.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginStatusResponse {

	private boolean isLoggedIn;
	private Long loginId;
	private Double totalLeave;
}

