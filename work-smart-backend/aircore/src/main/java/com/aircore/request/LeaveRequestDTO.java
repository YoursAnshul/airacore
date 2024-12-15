package com.aircore.request;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeaveRequestDTO {
    private Date fromDate;
    private Date toDate;
    private String leaveType;
    private String note;
    private String applyFor;
}
