package com.toolswap.toolswap.service;

import com.toolswap.toolswap.dto.ToolCreateRequest;
import com.toolswap.toolswap.dto.ToolUpdateRequest;
import com.toolswap.toolswap.model.Tool;
import com.toolswap.toolswap.model.User;
import com.toolswap.toolswap.repository.BookingRepository;
import com.toolswap.toolswap.repository.ToolRepository;
import com.toolswap.toolswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;


import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolService {

    private final ToolRepository toolRepository;
    private final UserRepository userRepository;
    private final ImageUploadService imageUploadService;
    private final BookingRepository bookingRepository;

    @Transactional // this manages DB transactions or also we can say that : all db operations within a particular method either all succeed together, or if even one fails, they all get rolled back       "CONSISTENCY"
    public Tool createTool(ToolCreateRequest toolCreateRequest, MultipartFile imageFile, String ownerEmail) throws IOException {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Owner not found"));

        String imageUrl = imageUploadService.uploadImage(imageFile);

        Tool tool = new Tool();
        tool.setName(toolCreateRequest.getName());
        tool.setCategory(toolCreateRequest.getCategory());
        tool.setDescription(toolCreateRequest.getDescription());
        tool.setOwner(owner);

        tool.setImageUrl(imageUrl);

        return toolRepository.save(tool);
    }

    @Transactional(readOnly = true)
    public List<Tool> getAllTools(){
        return toolRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tool getToolById(Long id){
        return toolRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Tool not found"));
    }

    @Transactional(readOnly = true)
    public List<Tool> getToolsByOwnerEmail(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Owner not found"));
        return toolRepository.findByOwnerId(owner.getId());
    }

    @Transactional
    public Tool updateTool(Long toolId, ToolUpdateRequest updateRequest, String userEmail) {
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Tool not found"));

        if (!tool.getOwner().getEmail().equals(userEmail)) {
            throw new SecurityException("User is not authorized to update this tool");
        }

        if (updateRequest.getName() != null && !updateRequest.getName().isEmpty()) {
            tool.setName(updateRequest.getName());
        }
        if (updateRequest.getCategory() != null && !updateRequest.getCategory().isEmpty()) {
            tool.setCategory(updateRequest.getCategory());
        }
        if (updateRequest.getDescription() != null && !updateRequest.getDescription().isEmpty()) {
            tool.setDescription(updateRequest.getDescription());
        }
        return toolRepository.save(tool);
    }

    @Transactional
    public void deleteTool(Long toolId, String userEmail){
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(()-> new RuntimeException("Tool not found"));

        if(!tool.getOwner().getEmail().equals(userEmail)){
            throw new SecurityException("User is not authorized to delete this tool");
        }

        bookingRepository.deleteAllByToolId(toolId);

        toolRepository.delete(tool);
    }
}
