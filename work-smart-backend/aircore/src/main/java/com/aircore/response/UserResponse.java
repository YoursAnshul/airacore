package com.aircore.response;

public interface UserResponse {
	
    Long getId();
    String getFirstName();
    String getLastName();
    String getEmail();
    String getMobileNumber();
    String getRole();
    String getRoleName();
    String getCreatedDate();
    String getStatus();
    Long getReporting_manager(); 
    String getTwoLevelLeaveApprove();
    
}
