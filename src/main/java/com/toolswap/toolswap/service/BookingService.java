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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

//import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final UserRepository userRepository;
    private final ToolRepository toolRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Booking createBooking(BookingRequestDTO requestDTO, String borrowerEmail) {
        User borrower = userRepository.findByEmail(borrowerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Borrower not found"));
        Tool tool = toolRepository.getReferenceById(requestDTO.getToolId());

        if (tool.getOwner().getId().equals(borrower.getId())) {
            throw new IllegalStateException("You cannot book your own tool");
        }

        boolean isBooked = bookingRepository.existsByToolIdAndStatusIn(
                tool.getId(),
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        if (isBooked) {
            throw new IllegalStateException("This tool is already requested or currently borrowed.");
        }

        Booking booking = new Booking();
        booking.setTool(tool);
        booking.setBorrower(borrower);
        booking.setStartDate(requestDTO.getStartDate());
        booking.setEndDate(requestDTO.getEndDate());
        booking.setStatus(BookingStatus.PENDING);
        Booking savedBooking = bookingRepository.save(booking);

        String ownerEmail = tool.getOwner().getEmail();
        messagingTemplate.convertAndSendToUser(
                ownerEmail,
                "/queue/notifications",
                "You have a new request for your tool!"
        );

        return savedBooking;
    }

    @Transactional(readOnly = true)
    public List<Booking> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return bookingRepository.findByBorrowerIdOrToolOwnerId(user.getId(), user.getId());
    }

    @Transactional
    public Booking updateBookStatus(Long bookingId, BookingStatus newStatus, String ownerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getTool().getOwner().getEmail().equals(ownerEmail)) {
            throw new SecurityException("Only the tool owner can update the booking status.");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking status can only be update if it if PENDING");
        }

        if (newStatus != BookingStatus.APPROVED && newStatus != BookingStatus.DECLINED)
            throw new IllegalArgumentException("Owner can only set status to APPROVED or DECLINED.");

        booking.setStatus(newStatus);
        Booking savedBooking = bookingRepository.save(booking);
        if (newStatus == BookingStatus.APPROVED) {
            try {
                User borrower = booking.getBorrower();
                Tool tool = booking.getTool();

                String to = borrower.getEmail();
                String subject = "Your ToolSwap Request was Approved!";
                String text = "Hi " + borrower.getName() + ",\n\n"
                        + "Your request to borrow '" + tool.getName() + "' "
                        + "from " + tool.getOwner().getName() + " has been approved.\n\n"
                        + "You can now coordinate a pickup time and location.\n\n"
                        + "Happy swapping!\n- The ToolSwap Team";

                emailService.sendSimpleMessage(to, subject, text);
            } catch (Exception e) {
                System.err.println("Failed to prepare or send approval email: " + e.getMessage());
            }
        }
        return savedBooking;
    }
}
