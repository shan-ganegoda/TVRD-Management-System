package com.content.security.util.regex;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface RegexPattern {

    public String reg() default "";
    public String msg() default "";
}
