package com.aircore.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenResponse {

	private String token;
	private String role;
	private String status;
	
}
