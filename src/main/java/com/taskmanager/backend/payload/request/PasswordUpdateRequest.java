package com.taskmanager.backend.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


public class PasswordUpdateRequest {
    @NotBlank
    @Size(max = 120)
    private String currentPassword;

    @NotBlank
    @Size(max = 120)
    private String password;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
