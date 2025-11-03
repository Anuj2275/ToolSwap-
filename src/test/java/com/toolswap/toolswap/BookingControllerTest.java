package com.toolswap.toolswap;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toolswap.toolswap.dto.*;
import com.toolswap.toolswap.model.BookingStatus;
import com.toolswap.toolswap.service.EmailService;
import com.toolswap.toolswap.service.ImageUploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
@Transactional
public class BookingControllerTest extends AbstractIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private ImageUploadService imageUploadService;

        @MockitoBean
        private EmailService emailService;

        @BeforeEach
        void setUp() throws Exception {
                when(imageUploadService.uploadImage(any(MockMultipartFile.class)))
                                .thenReturn("http://fake.cloudinary.url/image.jpg");

                doNothing().when(emailService).sendSimpleMessage(anyString(), anyString(), anyString());
        }

        private AuthResponse registerUser(String email, String password, String name) throws Exception {
                RegisterRequest registerRequest = new RegisterRequest();
                registerRequest.setName(name);
                registerRequest.setEmail(email);
                registerRequest.setPassword(password);

                MvcResult result = mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isOk())
                                .andReturn();

                return objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        }

        private ToolResponse createTool(String token, String toolName) throws Exception {
                ToolCreateRequest toolRequest = new ToolCreateRequest();
                toolRequest.setName(toolName);
                toolRequest.setCategory("Test Category");
                toolRequest.setDescription("Test Description");

                MockMultipartFile toolJsonPart = new MockMultipartFile("tool", "", MediaType.APPLICATION_JSON_VALUE,
                                objectMapper.writeValueAsBytes(toolRequest));
                MockMultipartFile imageFilePart = new MockMultipartFile("image", "test.jpg", MediaType.IMAGE_JPEG_VALUE,
                                "img".getBytes(StandardCharsets.UTF_8));

                MvcResult result = mockMvc.perform(multipart("/api/tools")
                                .file(toolJsonPart)
                                .file(imageFilePart)
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isCreated())
                                .andReturn();

                return objectMapper.readValue(result.getResponse().getContentAsString(), ToolResponse.class);
        }

        @Test
        void shouldCreateBookingSuccessfully() throws Exception {
                AuthResponse owner = registerUser("owner@test.edu.in", "Password123!", "Owner");
                AuthResponse borrower = registerUser("borrower@test.edu.in", "Password123!", "Borrower");
                ToolResponse tool = createTool(owner.getToken(), "Test Tool");

                BookingRequestDTO bookingRequest = new BookingRequestDTO();
                bookingRequest.setToolId(tool.getId());
                bookingRequest.setStartDate(LocalDateTime.now().plusDays(1));
                bookingRequest.setEndDate(LocalDateTime.now().plusDays(2));

                mockMvc.perform(post("/api/bookings")
                                .header("Authorization", "Bearer " + borrower.getToken())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(bookingRequest)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.status", is("PENDING")))
                                .andExpect(jsonPath("$.borrower.id", is(borrower.getId().intValue())))
                                .andExpect(jsonPath("$.owner.id", is(owner.getId().intValue())));
        }

        @Test
        void shouldFailToBookOwnTool() throws Exception {
                AuthResponse owner = registerUser("selfbooker@test.edu.in", "Password123!", "Self Booker");
                ToolResponse tool = createTool(owner.getToken(), "My Own Tool");

                BookingRequestDTO bookingRequest = new BookingRequestDTO();
                bookingRequest.setToolId(tool.getId());
                bookingRequest.setStartDate(LocalDateTime.now().plusDays(1));
                bookingRequest.setEndDate(LocalDateTime.now().plusDays(2));

                mockMvc.perform(post("/api/bookings")
                                .header("Authorization", "Bearer " + owner.getToken())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(bookingRequest)))
                                .andExpect(status().isConflict());
        }

        @Test
        void shouldGetMyBookingsAsOwnerAndBorrower() throws Exception {
                AuthResponse owner = registerUser("owner2@test.edu.in", "Password123!", "Owner 2");
                AuthResponse borrower = registerUser("borrower2@test.edu.in", "Password123!", "Borrower 2");
                ToolResponse tool = createTool(owner.getToken(), "Tool for Booking");

                BookingRequestDTO bookingRequest = new BookingRequestDTO();
                bookingRequest.setToolId(tool.getId());
                bookingRequest.setStartDate(LocalDateTime.now().plusDays(1));
                bookingRequest.setEndDate(LocalDateTime.now().plusDays(2));

                mockMvc.perform(post("/api/bookings")
                                .header("Authorization", "Bearer " + borrower.getToken())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(bookingRequest)))
                                .andExpect(status().isCreated());

                mockMvc.perform(get("/api/bookings/my-bookings")
                                .header("Authorization", "Bearer " + borrower.getToken()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(1)))
                                .andExpect(jsonPath("$[0].borrower.id", is(borrower.getId().intValue())));

                mockMvc.perform(get("/api/bookings/my-bookings")
                                .header("Authorization", "Bearer " + owner.getToken()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(1)))
                                .andExpect(jsonPath("$[0].owner.id", is(owner.getId().intValue())));
        }

        @Test
        void shouldAllowOwnerToUpdateBookingStatus() throws Exception {
                AuthResponse owner = registerUser("owner3@test.edu.in", "Password123!", "Owner 3");
                AuthResponse borrower = registerUser("borrower3@test.edu.in", "Password123!", "Borrower 3");
                ToolResponse tool = createTool(owner.getToken(), "Approvable Tool");

                BookingRequestDTO bookingRequest = new BookingRequestDTO();
                bookingRequest.setToolId(tool.getId());
                bookingRequest.setStartDate(LocalDateTime.now().plusDays(1));
                bookingRequest.setEndDate(LocalDateTime.now().plusDays(2));

                MvcResult createResult = mockMvc.perform(post("/api/bookings")
                                .header("Authorization", "Bearer " + borrower.getToken())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(bookingRequest)))
                                .andExpect(status().isCreated())
                                .andReturn();

                BookingResponsetDTO createdBooking = objectMapper
                                .readValue(createResult.getResponse().getContentAsString(), BookingResponsetDTO.class);
                Long bookingId = createdBooking.getId();

                BookingStatusUpdateRequestDTO updateRequest = new BookingStatusUpdateRequestDTO();
                updateRequest.setStatus(BookingStatus.APPROVED);

                mockMvc.perform(put("/api/bookings/" + bookingId + "/status")
                                .header("Authorization", "Bearer " + owner.getToken())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status", is("APPROVED")));

                verify(emailService).sendSimpleMessage(anyString(), anyString(), anyString());
        }

        @Test
        void shouldForbidBorrowerFromUpdatingBookingStatus() throws Exception {
                AuthResponse owner = registerUser("owner4@test.edu.in", "Password123!", "Owner 4");
                AuthResponse borrower = registerUser("borrower4@test.edu.in", "Password123!", "Borrower 4");
                ToolResponse tool = createTool(owner.getToken(), "Forbidden Tool");

                BookingRequestDTO bookingRequest = new BookingRequestDTO();
                bookingRequest.setToolId(tool.getId());
                bookingRequest.setStartDate(LocalDateTime.now().plusDays(1));
                bookingRequest.setEndDate(LocalDateTime.now().plusDays(2));

                MvcResult createResult = mockMvc.perform(post("/api/bookings")
                                .header("Authorization", "Bearer " + borrower.getToken())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(bookingRequest)))
                                .andExpect(status().isCreated())
                                .andReturn();

                BookingResponsetDTO createdBooking = objectMapper
                                .readValue(createResult.getResponse().getContentAsString(), BookingResponsetDTO.class);
                Long bookingId = createdBooking.getId();

                BookingStatusUpdateRequestDTO updateRequest = new BookingStatusUpdateRequestDTO();
                updateRequest.setStatus(BookingStatus.APPROVED);

                mockMvc.perform(put("/api/bookings/" + bookingId + "/status")
                                .header("Authorization", "Bearer " + borrower.getToken())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andExpect(status().isForbidden());
        }
}