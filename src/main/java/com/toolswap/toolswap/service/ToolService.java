package com.toolswap.toolswap.service;

import com.toolswap.toolswap.dto.ToolCreateRequest;
import com.toolswap.toolswap.model.Tool;
import com.toolswap.toolswap.model.User;
import com.toolswap.toolswap.repository.ToolRepository;
import com.toolswap.toolswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolService {

    private final ToolRepository toolRepository;
    private final UserRepository userRepository;

    @Transactional // this manages DB transactions
    public Tool createTool(ToolCreateRequest toolCreateRequest, String ownerEmail){
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Owner not found"));

        Tool tool = new Tool();
        tool.setName(toolCreateRequest.getName());
        tool.setCategory(toolCreateRequest.getCategory());
        tool.setDescription(toolCreateRequest.getDescription());
        tool.setOwner(owner);

        tool.setImageUrl("https://via.placeholder.com/150"); // for now, using a placeholder

        return toolRepository.save(tool);
    }

    @Transactional
    public List<Tool> getAllTools(){
        return toolRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tool getToolById(Long id){
        return toolRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Tool not found"));
    }

    @Transactional
    public void deleteTool(Long toolId, String userEmail){
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(()-> new RuntimeException("Tool not found"));

        if(!tool.getOwner().getEmail().equals(userEmail)){
            throw new SecurityException("User is not authorized to delete this tool");
        }

        toolRepository.delete(tool);
    }
}
