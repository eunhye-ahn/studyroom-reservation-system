package com.LibReserve.backend.service;

import com.LibReserve.backend.domain.StudySession;
import com.LibReserve.backend.repository.StudySessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class TimerService {
    @Autowired
    private StudySessionRepository sessionRepository;

    //타이머 시작
    public StudySession startTimer(String subject){
        Optional<StudySession> runningSession = sessionRepository.findByStatus("RUNNING");
        if(runningSession.isPresent()){
            throw new IllegalStateException("이미 실행 중인 타이머가 있습니다.");
        }

        StudySession session = new StudySession(LocalDateTime.now(), subject);
        return sessionRepository.save(session);
    }

    //타이머 정지
    public StudySession stopTime(){
        Optional<StudySession> runningSession = sessionRepository.findByStatus("RUNNING");
        if (runningSession.isEmpty()){
            throw new IllegalStateException("실행 중인 타이머가 없습니다.");
        }

        StudySession session = runningSession.get();
        session.setStudyEndTime(LocalDateTime.now());
        session.setStatus("STOPPED");

        // 총 공부시간 계산
        Long duration = ChronoUnit.SECONDS.between(session.getStudyStartTime(), session.getStudyEndTime());
        session.setDuration(duration);

        return sessionRepository.save(session);
    }

    //타이머 재시작
    public StudySession resumTimer(){
        Optional<StudySession> pausedSession = sessionRepository.findByStatus("PAUSED");
        if(pausedSession.isEmpty()){
            throw new IllegalStateException("일시정지된 타이머가 없습니다.");
        }

        StudySession session = pausedSession.get();
        session.setStatus("RUNNING");

        //재시작 시간 조정(일시정지된 시간만큼 시작 시간 늦춤)
        LocalDateTime adjustedStartTime = LocalDateTime.now().minusSeconds(session.getDuration());
        session.setStudyStartTime(adjustedStartTime);

        return sessionRepository.save(session);
    }

    public Optional<StudySession> getCurrentSession(){
        Optional<StudySession> runningSession = sessionRepository.findByStatus("RUNNING");
        if(runningSession.isPresent()){
            return runningSession;
        }
        return sessionRepository.findByStatus("PAUSED");
    }

    //현재 경과 시간 계산
//    public Long getCurrentElapsedTime(){
//        Optional<StudySession> runningSession =
//    }
}
