package com.aircore.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuRequest {
	private String name;
	private boolean isCreate;
	private boolean isRead;
	private boolean isUpdate;
	private boolean isDelete;
}
