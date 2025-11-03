package com.toolswap.toolswap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toolswap.toolswap.dto.AuthResponse;
import com.toolswap.toolswap.dto.RegisterRequest;
import com.toolswap.toolswap.dto.ToolCreateRequest;
import com.toolswap.toolswap.dto.ToolResponse;
import com.toolswap.toolswap.service.ImageUploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
@Transactional
public class ToolControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ImageUploadService imageUploadService;

    @BeforeEach
    void setUp() throws Exception {
        // Mock the image service to prevent real uploads
        when(imageUploadService.uploadImage(any(MockMultipartFile.class)))
                .thenReturn("http://fake.cloudinary.url/image.jpg");
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

    @Test
    void shouldCreateToolSuccessfully() throws Exception {
        AuthResponse ownerAuth = registerUser("owner@university.edu.in", "Password123!", "Tool Owner");
        String ownerToken = ownerAuth.getToken();

        ToolCreateRequest toolRequest = new ToolCreateRequest();
        toolRequest.setName("Test Drill");
        toolRequest.setCategory("Power Tools");
        toolRequest.setDescription("A drill for testing");

        MockMultipartFile toolJsonPart = new MockMultipartFile(
                "tool",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(toolRequest));

        MockMultipartFile imageFilePart = new MockMultipartFile(
                "image",
                "test-image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "testimagedata".getBytes(StandardCharsets.UTF_8));

        mockMvc.perform(multipart("/api/tools")
                        .file(toolJsonPart)
                        .file(imageFilePart)
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(notNullValue())))
                .andExpect(jsonPath("$.name", is("Test Drill")))
                .andExpect(jsonPath("$.category", is("Power Tools")))
                .andExpect(jsonPath("$.imageUrl", is("http://fake.cloudinary.url/image.jpg")))
                .andExpect(jsonPath("$.owner.id", is(ownerAuth.getId().intValue())))
                .andExpect(jsonPath("$.owner.name", is("Tool Owner")));
    }

    @Test
    void shouldFailToCreateToolWhenUnauthenticated() throws Exception {
        ToolCreateRequest toolRequest = new ToolCreateRequest();
        toolRequest.setName("Test Drill");
        toolRequest.setCategory("Power Tools");
        toolRequest.setDescription("A drill for testing");

        MockMultipartFile toolJsonPart = new MockMultipartFile("tool", "", MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(toolRequest));
        MockMultipartFile imageFilePart = new MockMultipartFile("image", "test-image.jpg",
                MediaType.IMAGE_JPEG_VALUE, "testimagedata".getBytes(StandardCharsets.UTF_8));

        mockMvc.perform(multipart("/api/tools")
                        .file(toolJsonPart)
                        .file(imageFilePart))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldGetAllToolsAnonymously() throws Exception {
        mockMvc.perform(get("/api/tools"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void shouldFailToDeleteAnotherUsersTool() throws Exception {
        AuthResponse ownerAuth = registerUser("real-owner@university.edu.in", "Password123!", "Real Owner");
        String ownerToken = ownerAuth.getToken();

        AuthResponse attackerAuth = registerUser("attacker@university.edu.in", "Password456!", "Attacker");
        String attackerToken = attackerAuth.getToken();

        ToolCreateRequest toolRequest = new ToolCreateRequest();
        toolRequest.setName("Valuable Tool");
        toolRequest.setCategory("Test");
        toolRequest.setDescription("My precious");

        MockMultipartFile toolJsonPart = new MockMultipartFile("tool", "", MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(toolRequest));
        MockMultipartFile imageFilePart = new MockMultipartFile("image", "test-image.jpg",
                MediaType.IMAGE_JPEG_VALUE, "testimagedata".getBytes(StandardCharsets.UTF_8));

        MvcResult createResult = mockMvc.perform(multipart("/api/tools")
                        .file(toolJsonPart)
                        .file(imageFilePart)
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isCreated())
                .andReturn();

        ToolResponse createdTool = objectMapper.readValue(createResult.getResponse().getContentAsString(),
                ToolResponse.class);
        Long toolId = createdTool.getId();

        mockMvc.perform(delete("/api/tools/" + toolId)
                        .header("Authorization", "Bearer " + attackerToken))
                .andExpect(status().isForbidden());
    }
}