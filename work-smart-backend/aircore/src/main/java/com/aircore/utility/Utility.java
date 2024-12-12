package com.aircore.utility;

import jakarta.servlet.http.HttpServletRequest;

public class Utility {

	public static String getClientIpAddress(HttpServletRequest request) {
	    String ipAddress = request.getHeader("X-Forwarded-For");
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("Proxy-Client-IP");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("WL-Proxy-Client-IP");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("HTTP_X_FORWARDED_FOR");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("HTTP_X_FORWARDED");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("HTTP_X_CLUSTER_CLIENT_IP");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("HTTP_CLIENT_IP");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("HTTP_FORWARDED_FOR");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("HTTP_FORWARDED");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getHeader("HTTP_VIA");
	    }
	    if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
	        ipAddress = request.getRemoteAddr(); 
	    }
	    return ipAddress;
	}

	
}
