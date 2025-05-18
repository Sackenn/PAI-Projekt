package com.taskmanager.backend.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


public class UsernameUpdateRequest {
    @NotBlank
    @Size(max = 20)
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}