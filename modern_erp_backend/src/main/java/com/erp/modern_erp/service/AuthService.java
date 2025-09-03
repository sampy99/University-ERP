package com.erp.modern_erp.service;

import com.erp.modern_erp.dto.request.SignupRequest;
import com.erp.modern_erp.dto.response.SignupResponse;

public interface AuthService {
    SignupResponse signup(SignupRequest req);

}