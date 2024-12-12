package com.aircore.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginStatusResponse {

	private boolean isLoggedIn;
	private Long loginId;

}
