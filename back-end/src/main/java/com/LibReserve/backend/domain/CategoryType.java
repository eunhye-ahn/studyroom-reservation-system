package com.LibReserve.backend.domain;

public enum CategoryType {
    general_pc("일반/PC"),
    group_study("그룹 스터디실"),
    personal_carrel("개인 캐럴");

    private final String displayName;

    CategoryType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
