package com.toolswap.toolswap.repository;

import com.toolswap.toolswap.model.Booking;
import com.toolswap.toolswap.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking,Long> {

    List<Booking> findByBorrowerIdOrToolOwnerId(Long borrowerId, Long ownerId);
    void deleteAllByToolId(Long toolId);
    List<Booking> findByStatusAndEndDateBetween(BookingStatus status, LocalDateTime start, LocalDateTime end);
}
