package com.toolswap.toolswap.service;

import com.toolswap.toolswap.dto.BookingRequestDTO;
import com.toolswap.toolswap.model.Booking;
import com.toolswap.toolswap.model.BookingStatus;
import com.toolswap.toolswap.model.Tool;
import com.toolswap.toolswap.model.User;
import com.toolswap.toolswap.repository.BookingRepository;
import com.toolswap.toolswap.repository.ToolRepository;
import com.toolswap.toolswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.script.ScriptException;
import java.awt.print.Book;
import java.util.List;

//import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
        private final UserRepository userRepository;
        private final ToolRepository toolRepository;
        private final BookingRepository bookingRepository;

        @Transactional
        public Booking createBooking(BookingRequestDTO requestDTO, String borrowerEmail){
            User borrower = userRepository.findByEmail(borrowerEmail)
                    .orElseThrow(()-> new UsernameNotFoundException("Borrower not found"));
            Tool tool = toolRepository.getReferenceById(requestDTO.getToolId());

            if(tool.getOwner().getId().equals(borrower.getId())) {
                throw new IllegalStateException("You cannot book your own tool");
            }

            Booking booking = new Booking();
            booking.setTool(tool);
            booking.setBorrower(borrower);
            booking.setStartDate(requestDTO.getStartDate());
            booking.setEndDate(requestDTO.getEndDate());
            booking.setStatus(BookingStatus.PENDING);

            return bookingRepository.save(booking);
        }

        @Transactional(readOnly = true)
        public List<Booking> getMyBookings(String userEmail){
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(()-> new UsernameNotFoundException("User not found"));

            return bookingRepository.findByBorrowerIdOrToolOwnerId(user.getId(),user.getId());
        }

        @Transactional
        public Booking updateBookStatus(Long bookingId, BookingStatus newStatus, String ownerEmail){
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(()-> new RuntimeException("Booking not found"));

            if(!booking.getTool().getOwner().getEmail().equals(ownerEmail)){
                throw new SecurityException("Only the tool owner can update the booking status.");
            }

            if (booking.getStatus() != BookingStatus.PENDING){
                throw new IllegalStateException("Booking status can only be update if it if PENDING");
            }

            if(newStatus != BookingStatus.APPROVED  &&  newStatus != BookingStatus.DECLINED)
                throw new IllegalArgumentException("Owner can only set status to APPROVED or DECLINED.");

            booking.setStatus(newStatus);
            return bookingRepository.save(booking);
        }
}
