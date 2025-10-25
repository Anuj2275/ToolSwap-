package com.toolswap.toolswap.controller;

import com.toolswap.toolswap.config.AppUserDetails;
import com.toolswap.toolswap.dto.ToolCreateRequest;
import com.toolswap.toolswap.dto.ToolResponse;
import com.toolswap.toolswap.dto.ToolUpdateRequest;
import com.toolswap.toolswap.mapper.ToolMapper;
import com.toolswap.toolswap.model.Tool;
import com.toolswap.toolswap.service.ToolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tools")
@RequiredArgsConstructor
public class ToolController {

    private final ToolService toolService;
//@AuthenticationPrincipal AppUserDetails userDetails --> spring sec injects the currently logged-in user, app user dets is custom user dets implementation,,,, to know who is creating the req
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ToolResponse> createTool
    (@Valid @RequestPart("tool") ToolCreateRequest toolRequest,
    @RequestPart("image") MultipartFile imageFile,
    @AuthenticationPrincipal AppUserDetails userDetails) throws IOException {
        Tool createTool = toolService.createTool(toolRequest,imageFile,userDetails.getUsername());
        return new ResponseEntity<>(ToolMapper.toDto(createTool), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ToolResponse>> getAllTools(){
        List<ToolResponse> tools = toolService.getAllTools().stream() // conver list into stream,allows functional-style operations
                .map(ToolMapper::toDto) // convert each tool to ToolRes
                .collect(Collectors.toList()); // convert back to List

        return ResponseEntity.ok(tools);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToolResponse> getToolById(@PathVariable Long id){
        Tool tool = toolService.getToolById(id);
        return ResponseEntity.ok(ToolMapper.toDto(tool));
    }

    @GetMapping("/my-tools")
    public ResponseEntity<List<ToolResponse>> getMyTools(@AuthenticationPrincipal AppUserDetails userDetails) {
        List<ToolResponse> tools = toolService.getToolsByOwnerEmail(userDetails.getUsername()).stream()
                .map(ToolMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tools);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ToolResponse> updateTool(
            @PathVariable Long id,
            @Valid @RequestBody ToolUpdateRequest updateRequest,
            @AuthenticationPrincipal AppUserDetails userDetails) {
        Tool updatedTool = toolService.updateTool(id, updateRequest, userDetails.getUsername());
        return ResponseEntity.ok(ToolMapper.toDto(updatedTool));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails appUserDetails){
        toolService.deleteTool(id,appUserDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

}