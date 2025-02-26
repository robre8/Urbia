package com.nocountry.urbia.controller;

import com.nocountry.urbia.dto.request.LoginRequest;
import com.nocountry.urbia.dto.request.UsuarioRegistroRequest;
import com.nocountry.urbia.dto.response.JwtResponse;
import com.nocountry.urbia.dto.response.UsuarioResponse;
import com.nocountry.urbia.service.impl.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class  AuthController {
    private final UsuarioServiceImpl usuarioService;

    @Autowired
    public AuthController(UsuarioServiceImpl usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = usuarioService.authenticate(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> registerUser(@RequestBody UsuarioRegistroRequest signUpRequest) {
        UsuarioResponse usuarioResponse = usuarioService.registerUser(signUpRequest);
        return new ResponseEntity<>(usuarioResponse, HttpStatus.CREATED);
    }
}

