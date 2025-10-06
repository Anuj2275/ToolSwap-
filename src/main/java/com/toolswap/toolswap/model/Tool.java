package com.toolswap.toolswap.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Entity
@Table(name = "tool")
@Getter
@Setter
public class Tool {

    @Id
    @NonNull
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    @Column(nullable = false)
    private String name;

    @NotEmpty
    private String category;

    @NotEmpty
    @Column(columnDefinition = "TEXT")  // SQL type for the col or @Lob can also be used which is for Large object and will map it to TEXT
    private String description;

    @NotEmpty
    private String imageUrl; // for url from cloudinary


    // many tools can be owned by 1 user, owner is loaded only when needed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false) // creation of FK in tool table, ref to user.id
    private User owner;


}
