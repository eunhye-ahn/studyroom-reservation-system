package com.LibReserve.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;


public enum Role {
        STUDENT,
        GRADUATE,
        LIBRARIAN,
        PROFESSOR,
        ADMIN
}
