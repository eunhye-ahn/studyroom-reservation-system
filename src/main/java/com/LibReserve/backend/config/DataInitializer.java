package com.LibReserve.backend.config;

import com.LibReserve.backend.domain.ReadingRoom;
import com.LibReserve.backend.domain.Role;
import com.LibReserve.backend.domain.Seat;
import com.LibReserve.backend.domain.User;
import com.LibReserve.backend.repository.ReadingRoomRepository;
import com.LibReserve.backend.repository.SeatRepository;
import com.LibReserve.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer {

    private final ReadingRoomRepository readingRoomRepository;
    private final SeatRepository seatRepository;

    public DataInitializer(ReadingRoomRepository readingRoomRepository, SeatRepository seatRepository) {
        this.readingRoomRepository = readingRoomRepository;
        this.seatRepository = seatRepository;

    }

    @PostConstruct
    @Transactional
    public void init() {
        String[] roomNames = {"201호", "202호", "401호"};

        for (String name : roomNames) {
            ReadingRoom room = new ReadingRoom();
            room.setName(name);
            readingRoomRepository.save(room);

            for (int i = 1; i <= 100; i++) {
                Seat seat = new Seat();
                seat.setNumber(i);
                seat.setReadingRoom(room);
                seatRepository.save(seat);
            }


        }

        System.out.println("✅ 열람실 및 좌석 데이터 초기화 완료");
    }
}
