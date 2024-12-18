package com.aircore.response;

import java.util.Date;

import com.aircore.utility.Enumeration.AplyType;
import com.aircore.utility.Enumeration.LeaveStatus;
import com.aircore.utility.Enumeration.LeaveType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LeaveRequestResponse {
    private Long id;
    private String username;
    private Date startDate;
    private Date endDate;
    private LeaveType leaveType;
    private LeaveStatus leaveStatus;
    private String approvedByName;
    private String description;
    private Date createdDate;
    private Date updateDate;
    private String rejectReason;
    private AplyType applyFor;
}

