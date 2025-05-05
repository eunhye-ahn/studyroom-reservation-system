package com.LibReserve.backend.service;

import com.LibReserve.backend.domain.ReadingRoom;
import com.LibReserve.backend.repository.ReadingRoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReadingRoomService {
    private final ReadingRoomRepository readingRoomRepository;

    public ReadingRoomService(ReadingRoomRepository readingRoomRepository) {
        this.readingRoomRepository = readingRoomRepository;
    }

    public List<ReadingRoom> getAllRooms(){
        return readingRoomRepository.findAll();
    }
}
