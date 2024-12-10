package com.aircore.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class DateRangeRequest {
    private LocalDate dateFrom;
    private LocalDate dateTo;
}

