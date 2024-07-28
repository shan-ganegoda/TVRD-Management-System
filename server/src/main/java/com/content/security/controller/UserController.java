package com.content.security.controller;

import com.content.security.dto.UserDTO;
import com.content.security.entity.User;
import com.content.security.service.UserService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserDTO> getAllUsers(@RequestParam HashMap<String,String> params){
        List<UserDTO> userList = userService.getAllUsers(params);
        return userList;

//        return new ResponseEntity<StandardResponse>(
//                new StandardResponse(200,"Success",userList), HttpStatus.OK
//        );
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Integer id){

        UserDTO user = userService.getUserById(id);
        return user;

//        return new ResponseEntity<StandardResponse>(
//                new StandardResponse(200,"Success",user), HttpStatus.OK
//        );
    }

    @PostMapping
    public UserDTO addUser(@RequestBody UserDTO userdto){
        UserDTO userDTO = userService.saveUser(userdto);
        return userDTO;


    }

    @PutMapping
    public ResponseEntity<StandardResponse> updateUser(@RequestBody UserDTO userdto){
        String message = userService.updateUser(userdto);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Updated",message), HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteUser(@PathVariable Integer id){
        String message = userService.deleteUser(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }

}
