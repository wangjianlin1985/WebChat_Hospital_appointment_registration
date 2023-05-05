package com.client.utils;

import java.util.UUID;

/**
 * Created by xxx
 * <p>
 * UUID生成类
 */
public class UUIDGenerator {

    public static String generate() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}
