package com.aircore.utility;

public class StringUtility {

	public static boolean isNullOrEmpty(String value) {
		if(value == null || value.length() == 0) {
			return true;
		}
		return false;
	}

}
