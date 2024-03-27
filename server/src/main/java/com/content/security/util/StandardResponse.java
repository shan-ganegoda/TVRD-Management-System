package com.content.security.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StandardResponse {

    private Integer code;
    private String message;
    private Object data;
}
