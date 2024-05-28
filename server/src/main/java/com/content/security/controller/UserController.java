package com.content.security.controller;

import com.content.security.dto.UserDTO;
import com.content.security.entity.User;
import com.content.security.service.UserService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<StandardResponse> getAllUsers(){
        List<UserDTO> userList = userService.getAllUsers();

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Success",userList), HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getUserById(@RequestParam Integer id){

        UserDTO user = userService.getUserById(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Success",user), HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<StandardResponse> addUser(@RequestBody UserDTO userdto){

        String message = userService.saveUser(userdto);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Created",message), HttpStatus.CREATED
        );
    }

    @PutMapping
    public ResponseEntity<StandardResponse> updateUser(@RequestBody UserDTO userdto){
        String message = userService.updateUser(userdto);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Updated",message), HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteUser(@RequestParam Integer id){
        String message = userService.deleteUser(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Updated",message), HttpStatus.OK
        );
    }
}
