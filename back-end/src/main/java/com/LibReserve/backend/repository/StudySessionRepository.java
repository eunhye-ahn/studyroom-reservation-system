package com.LibReserve.backend.repository;

import com.LibReserve.backend.domain.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Integer> {
    //현재 실행중인 세션찾기
    Optional<StudySession> findByStatus(String status);

    //특정 날짜 범위의 세션 조회
    List<StudySession> findByStudyStartTimeBetween(LocalDateTime start, LocalDateTime end);

    //특정 과목 세션 조회
    List<StudySession> findBySubjectOrderByStudyStartTimeDesc(String subject);

    //오늘 총 공부 시간 계산
    @Query("SELECT SUM(s.duration) FROM StudySession s WHERE DATE(s.studyStartTime) = CURRENT_DATE AND s.status = 'COMPLETED'")
    Long getTotalStudyTimeToday();

    //이번주 총 공부시간
    @Query("SELECT sum(s.duration) FROM StudySession s WHERE WEEK(s.studyStartTime) = WEEK(CURRENT_DATE) AND s.status = 'COMPLETED'")
    Long getTotalStudyTimeThisWeek();
}
