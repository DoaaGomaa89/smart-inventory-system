package com.inventory.util;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Base64;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println("Secure JWT Secret Key:");
        System.out.println(base64Key);
    }
}


//This code is used to generate secret Jwt key which is used in application.properties file for JWT configuration.
// This code is used only once at the beginning of the project and to run separately (i.e. run as -> Java application.)
