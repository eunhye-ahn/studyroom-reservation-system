package com.LibReserve.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="study_sessions")
public class StudySession {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private LocalDateTime studyStartTime;

    @Column
    private LocalDateTime studyEndTime;

    @Column(nullable=false)
    private Long duration;

    @Column(nullable=false)
    private String status; //Running, paused, completed

    @Column
    private String subject;

    @Column
    private String memo;

    public StudySession() {}

    public StudySession(LocalDateTime studyStartTime, String subject){
        this.studyStartTime = studyStartTime;
        this.subject = subject;
        this.status = "RUNNING";
        this.duration=0L;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getStudyStartTime() {
        return studyStartTime;
    }

    public void setStudyStartTime(LocalDateTime studyStartTime) {
        this.studyStartTime = studyStartTime;
    }

    public LocalDateTime getStudyEndTime() {
        return studyEndTime;
    }

    public void setStudyEndTime(LocalDateTime studyEndTime) {
        this.studyEndTime = studyEndTime;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
