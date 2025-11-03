package com.toolswap.toolswap.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (!isImage(file)) {
            throw new IllegalArgumentException("Only image files (jpg, png, jpeg) are allowed.");
        }

        String publicId = "toolswap/" + UUID.randomUUID().toString();

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", publicId,
                "overwrite", true,
                "resource_type", "image",
                "transformation", new Transformation()
                        .width(1000)   // Resize to max 1000px width
                        .height(1000)  // Resize to max 1000px height
                        .crop("limit") // Keep aspect ratio, just cap size
                        .quality("auto:good")
        ));

        return (String) uploadResult.get("secure_url");
    }

    private boolean isImage(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/jpg"));
    }
}