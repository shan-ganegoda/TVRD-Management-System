package com.content.security.util.regex;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.HashMap;
import jakarta.validation.constraints.Pattern;

public class RegexProvider {

    public static <T> HashMap<String, HashMap<String, String>> get(T t) {
        try {
            Class<? extends Object> aClass = t.getClass();
            HashMap<String, HashMap<String, String>> regex = new HashMap<>();

            for (Field field : aClass.getDeclaredFields()) {

                Annotation[] annotations = field.getDeclaredAnnotations();

                for (Annotation annotation : annotations) {

                    if (annotation instanceof Pattern) {
                        Pattern myAnnotation = (Pattern) annotation;
                        HashMap<String, String> map = new HashMap<>();
                        map.put("regex", myAnnotation.regexp());
                        map.put("message", myAnnotation.message());
                        regex.put(field.getName(), map);
                    }

                    if (annotation instanceof RegexPattern) {
                        RegexPattern myAnnotation = (RegexPattern) annotation;
                        HashMap<String, String> map = new HashMap<>();
                        map.put("regex", myAnnotation.reg());
                        map.put("message", myAnnotation.msg());
                        regex.put(field.getName(), map);
                    }
                }
            }
            return regex;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
