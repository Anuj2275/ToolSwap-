package com.toolswap.toolswap.dto;

import com.toolswap.toolswap.model.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingStatusUpdateRequestDTO {
    @NotNull(message = "Status cannot be null")
    private BookingStatus status;
}
