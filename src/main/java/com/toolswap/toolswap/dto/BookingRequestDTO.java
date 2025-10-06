package com.toolswap.toolswap.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingRequestDTO {
    @NotNull(message = "Tool ID cannot be null")
    private Long toolId;

    @NotNull(message = "Start date cannot be null")
    @Future(message = "Start date must be in the future")
    private LocalDateTime startDate;

    @NotNull(message = "End date cannot be null")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;

}
