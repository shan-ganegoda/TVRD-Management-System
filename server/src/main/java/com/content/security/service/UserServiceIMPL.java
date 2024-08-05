package com.content.security.service;

import com.content.security.dto.UserDTO;
import com.content.security.entity.Employee;
import com.content.security.entity.User;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;

import com.content.security.repository.UserRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserServiceIMPL implements UserService {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDTO> getAllUsers(HashMap<String, String> params) {

        List<User> userList = userRepository.findAll();

        if (!userList.isEmpty()) {
            List<UserDTO> userDTOList = objectMapper.userListToUserDTOList(userList);

            if (params.isEmpty()) {
                return userDTOList;
            } else {
                String fullname = params.get("fullname");
                String email = params.get("email");
                String roleid = params.get("roleid");
                String userstatusid = params.get("userstatusid");

                Stream<UserDTO> estreame = userDTOList.stream();

                if (roleid != null)
                    estreame = estreame.filter(e -> e.getRoles().stream().anyMatch(role -> role.getId() == Integer.parseInt(roleid)));
                if (userstatusid != null)
                    estreame = estreame.filter(e -> e.getUserstatus().getId() == Integer.parseInt(userstatusid));
                if (email != null) estreame = estreame.filter(e -> e.getEmail().equals(email));
                if (fullname != null) estreame = estreame.filter(e -> e.getEmployee().getFullname().contains(fullname));

                return estreame.collect(Collectors.toList());
            }
        } else {
            throw new ResourceNotFountException("Users Not Found!");
        }

    }

    @Override
    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("User Does Not Exist"));
        UserDTO userDTO = objectMapper.userToUserDTO(user);
        return userDTO;
    }

    @Override
    public UserDTO saveUser(UserDTO userdto) {


        if (userRepository.existsByEmail(userdto.getEmail())) {
            throw new ResourceAlreadyExistException("Email Already Exist!");
        }

        Employee emp = objectMapper.employeeDTOTOEmployee(userdto.getEmployee());

        if (userRepository.existsByEmployee(emp)) {
            throw new ResourceAlreadyExistException("Employee Already Exist!");
        }
        User user = objectMapper.userDTOToUser(userdto);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setDocreated(Date.valueOf(LocalDate.now()));
        user.setTocreated(Time.valueOf(LocalTime.now()));

        userRepository.save(user);

        return userdto;


    }

    @Override
    public String updateUser(UserDTO userdto) {

        User userOpt = userRepository.findById(userdto.getId()).orElseThrow(() -> new ResourceNotFountException("User Does Not Exist"));

        if (!userOpt.getEmail().equals(userdto.getEmail()) && userRepository.existsByEmail(userdto.getEmail())) {
            throw new ResourceAlreadyExistException("Email Already Exist!");
        }

        User user = objectMapper.userDTOToUser(userdto);

        if (!user.getPassword().equals(userOpt.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        user.setDocreated(userOpt.getDocreated());
        user.setTocreated(userOpt.getTocreated());

        userRepository.save(user);

        return userdto.getEmail() + " Updated Successfully!";
    }

    @Override
    public String deleteUser(Integer id) {

        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);

            return "User Deleted Successfully! ";
        } else {
            throw new ResourceNotFountException("User Does Not Exist");
        }
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFountException("User Does Not Exist"));
        UserDTO userDTO = objectMapper.userToUserDTO(user);
        return userDTO;
    }


}
