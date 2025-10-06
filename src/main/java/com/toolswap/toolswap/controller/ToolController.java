package com.toolswap.toolswap.controller;

import com.toolswap.toolswap.config.AppUserDetails;
import com.toolswap.toolswap.dto.ToolCreateRequest;
import com.toolswap.toolswap.dto.ToolResponse;
import com.toolswap.toolswap.model.Tool;
import com.toolswap.toolswap.service.ToolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tools")
@RequiredArgsConstructor
public class ToolController {

    private final ToolService toolService;
//@AuthenticationPrincipal AppUserDetails userDetails --> spring sec injects the currently logged-in user, app user dets is custom user dets implementation,,,, to know who is creating the req
    @PostMapping
    public ResponseEntity<ToolResponse> createTool(@Valid @RequestBody ToolCreateRequest toolRequest, @AuthenticationPrincipal AppUserDetails userDetails){
        Tool createTool = toolService.createTool(toolRequest,userDetails.getUsername());
        return new ResponseEntity<>(convertToDto(createTool), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ToolResponse>> getAllTools(){
        List<ToolResponse> tools = toolService.getAllTools().stream() // conver list into stream,allows functional-style operations
                .map(this::convertToDto) // convert each tool to ToolRes
                .collect(Collectors.toList()); // convert back to List

        return ResponseEntity.ok(tools);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToolResponse> getToolById(@PathVariable Long id){
        Tool tool = toolService.getToolById(id);
        return ResponseEntity.ok(convertToDto(tool));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails appUserDetails){
        toolService.deleteTool(id,appUserDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

//    hide sensitive content
    private ToolResponse convertToDto(Tool tool){
        ToolResponse toolResponse = new ToolResponse();
        toolResponse.setId(tool.getId());
        toolResponse.setName(tool.getName());
        toolResponse.setDescription(tool.getDescription());
        toolResponse.setImageUrl(tool.getImageUrl());

//        each tool has owner, don't want to expose sensitive in res, so we created ownerDTO oly with id and name of owner
        ToolResponse.OwnerDTO ownerDTO = new ToolResponse.OwnerDTO();
        ownerDTO.setId(tool.getOwner().getId());
        ownerDTO.setName(tool.getOwner().getName());
        toolResponse.setOwner(ownerDTO);

        return toolResponse;
    }
}