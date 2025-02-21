package com.backend.urbia.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private List<String> detalles;

    public ErrorResponse() {}

    public ErrorResponse(LocalDateTime timestamp, int status, String error, List<String> detalles) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.detalles = detalles;
    }

    // Getters y Setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public List<String> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<String> detalles) {
        this.detalles = detalles;
    }
}
