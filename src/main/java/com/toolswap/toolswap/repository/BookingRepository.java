package com.toolswap.toolswap.repository;

import com.toolswap.toolswap.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking,Long> {

    List<Booking> findByBorrowerIdOrToolOwnerId(Long borrowerId, Long ownerId);
}
