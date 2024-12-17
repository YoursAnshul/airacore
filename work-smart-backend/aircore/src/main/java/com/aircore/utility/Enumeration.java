package com.aircore.utility;

public class Enumeration {

	public enum PERMISSION_NAME {
		ADD, DELETE, UPDATE, VIEW, ALL
	}
	
	public enum Status {
		ACTIVE, DELETED
	}
	
	public enum LoginType {
		WEB_CLOCK_IN, WFO, PARTIAL_DAY
	}
	
	public enum CurrentStatus {
		LOGIN, LOGOUT
	}
	
	public enum LeaveType {
		SICK_LEAVE, CASUAL_LEAVE, PRIVILEGE_LEAVE, UNPAID_LEAVE
	}
	
	public enum LeaveStatus {
		APPROVED, REJECTED, PENDING, PARTIALLY_APPROVED, CANCELLED
	}
	
	public enum AplyType {
		FIRST_HALF, SECOND_HALF, FULL_DAY
	}
	
}
