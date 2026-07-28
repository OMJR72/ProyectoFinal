package com.proyectofinal.eq16.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofinal.eq16.repository.TareaRepository;
import com.proyectofinal.eq16.models.Tarea;

@Service
public class TareaService {
    private final TareaRepository tareaRepository;

    public TareaService(TareaRepository tareaRepository){
        this.tareaRepository = tareaRepository;
    }

    @Transactional(readOnly = true)
    public List<Tarea> listarTarea(){
        return tareaRepository.findAll();
    }
}
