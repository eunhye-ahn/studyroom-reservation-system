package com.studyroomReservation.backend.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "study_rooms")
public class StudyRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private int capacity;

    @OneToMany(mappedBy ="studyRoom", cascade=CascadeType.ALL)
    private List<Reservation> reservations;


    public StudyRoom() {
    }


    public StudyRoom(String name, int capacity) {
        this.name = name;
        this.capacity = capacity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }
}
