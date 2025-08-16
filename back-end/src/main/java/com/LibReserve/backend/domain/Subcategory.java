package com.LibReserve.backend.domain;

public enum Subcategory {
    DATA_CENTER("자료관"),
    STUDY_CENTER("학습관"),

    //그룹스터디실
    PERSON_1("1인"),
    PERSON_2("2인"),
    PERSON_4("4인"),
    PERSON_6("6인"),
    PERSON_12("12인");

    private final String displayName;

    Subcategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

