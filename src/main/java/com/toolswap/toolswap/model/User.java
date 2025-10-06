package com.toolswap.toolswap.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name ="app_user")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // for auto-increment col strategy in DB
    private Long id;

    @NotEmpty
    @Column(nullable = false)  // must not be null
    private String name;

    @NotEmpty
    @Column(nullable = false, unique = true)
    private String email;

    @NotEmpty
    @Column(nullable = false)
    private String password;
}
