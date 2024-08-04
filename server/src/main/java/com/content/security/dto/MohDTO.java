package com.content.security.dto;

import com.content.security.entity.Rdh;
import com.content.security.entity.Employee;
import com.content.security.entity.Mohstatus;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MohDTO {

        private Integer id;
        @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Fullname")
        private String name;
        @Pattern(regexp = "^0\\d{9}$", message = "Invalid Telephone Number")
        private String tele;
        @Pattern(regexp = "^0\\d{9}$", message = "Invalid Fax Number")
        private String faxno;
        private String email;
        private String location;
        private String address;
        private Time toopen;
        private Time toclose;
        private Date doestablished;
        private Employee employee;
        private Rdh rdh;
        private Mohstatus mohstatus;
        @Pattern(regexp = "^([A-Z]{3})$", message = "Invalid Codename")
        private String codename;

        public MohDTO(Integer id,String name){
                this.id = id;
                this.name = name;
        }

}
