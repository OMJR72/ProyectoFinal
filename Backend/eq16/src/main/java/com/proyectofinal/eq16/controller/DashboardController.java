package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.dto.DashboardResponse;
import com.proyectofinal.eq16.models.Actividad;
import com.proyectofinal.eq16.models.Sesion;
import com.proyectofinal.eq16.models.Tarea;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.security.UsuarioContext;
import com.proyectofinal.eq16.service.ActividadService;
import com.proyectofinal.eq16.service.SesionService;
import com.proyectofinal.eq16.service.TareaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UsuarioContext usuarioContext;
    private final TareaService tareaService;
    private final SesionService sesionService;
    private final ActividadService actividadService;

    public DashboardController(UsuarioContext usuarioContext, TareaService tareaService,
                               SesionService sesionService, ActividadService actividadService) {
        this.usuarioContext = usuarioContext;
        this.tareaService = tareaService;
        this.sesionService = sesionService;
        this.actividadService = actividadService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<DashboardResponse> resumen() {
        Usuario usuario = usuarioContext.getCurrentUser();
        DashboardResponse response = new DashboardResponse();

        response.setUsuario(crearMapUsuario(usuario));
        response.setMetricasHoy(calcularMetricasHoy(usuario));
        response.setProductividadSemanal(calcularProductividadSemanal(usuario));
        response.setPomodoroCompacto(calcularPomodoroCompacto(usuario));
        response.setTareasPrioritarias(calcularTareasPrioritarias(usuario));
        response.setActividadReciente(calcularActividadReciente(usuario));

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> crearMapUsuario(Usuario usuario) {
        Map<String, Object> map = new HashMap<>();
        map.put("nombre", usuario.getNombre());
        map.put("nombreCompleto", usuario.getNombre() + " " + usuario.getApellido());
        map.put("correo", usuario.getEmail());
        return map;
    }

    private Map<String, Object> calcularMetricasHoy(Usuario usuario) {
        Long userId = usuario.getId();
        LocalDateTime hoyInicio = LocalDate.now().atStartOfDay();
        LocalDateTime hoyFin = LocalDate.now().atTime(LocalTime.MAX);

        List<Sesion> sesionesHoy = sesionService.listarPorUsuarioYFecha(userId, hoyInicio, hoyFin);
        long minutosHoy = sesionesHoy.stream()
                .mapToLong(s -> s.getDuracion_minutos() != null ? s.getDuracion_minutos() : 0L)
                .sum();
        String tiempoEstudio = formatearMinutos(minutosHoy);

        List<Tarea> tareasPendientes = tareaService.listarPrioritariasPorUsuario(userId);
        long tareasPri = tareasPendientes.size();

        int metaPorcentaje = Math.min(100, (int) (minutosHoy * 100 / 120));

        Map<String, Object> map = new HashMap<>();
        map.put("tiempoEstudioHoy", tiempoEstudio);
        map.put("metaPorcentaje", metaPorcentaje);
        map.put("tareasPrioritariasHoy", (int) tareasPri);
        return map;
    }

    private List<Map<String, Object>> calcularProductividadSemanal(Usuario usuario) {
        Long userId = usuario.getId();
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        List<Map<String, Object>> resultado = new ArrayList<>();

        String[] dias = {"Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"};
        for (int i = 0; i < 7; i++) {
            LocalDate dia = weekStart.plusDays(i);
            LocalDateTime diaInicio = dia.atStartOfDay();
            LocalDateTime diaFin = dia.atTime(LocalTime.MAX);

            List<Sesion> sesionesDia = sesionService.listarPorUsuarioYFecha(userId, diaInicio, diaFin);
            long minutos = sesionesDia.stream()
                    .mapToLong(s -> s.getDuracion_minutos() != null ? s.getDuracion_minutos() : 0L)
                    .sum();

            Map<String, Object> item = new HashMap<>();
            item.put("dia", dias[i]);
            item.put("horas", (int) (minutos / 60));
            resultado.add(item);
        }
        return resultado;
    }

    private Map<String, Object> calcularPomodoroCompacto(Usuario usuario) {
        List<Sesion> sesiones = sesionService.listarPorUsuario(usuario.getId());
        int sesionActual = sesiones.size() + 1;

        Map<String, Object> map = new HashMap<>();
        map.put("minutos", 25);
        map.put("segundos", 0);
        map.put("sesionActual", sesionActual);
        map.put("progreso", 0.0);
        return map;
    }

    private List<Map<String, Object>> calcularTareasPrioritarias(Usuario usuario) {
        List<Tarea> tareas = tareaService.listarPrioritariasPorUsuario(usuario.getId());
        List<Map<String, Object>> resultado = new ArrayList<>();

        Map<String, String> prioridadMap = Map.of(
                "ALTA", "Alta", "MEDIA", "Media", "BAJA", "Baja"
        );

        for (Tarea t : tareas) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", t.getId_tarea());
            item.put("titulo", t.getTitulo());
            item.put("prioridad", prioridadMap.getOrDefault(t.getPrioridad(), t.getPrioridad()));
            resultado.add(item);
        }
        return resultado;
    }

    private List<Map<String, Object>> calcularActividadReciente(Usuario usuario) {
        List<Actividad> actividades = actividadService.listarPorUsuario(usuario.getId());
        List<Map<String, Object>> resultado = new ArrayList<>();

        int count = 0;
        for (Actividad a : actividades) {
            if (count >= 5) break;
            Map<String, Object> item = new HashMap<>();
            item.put("id", a.getId_actividad());
            item.put("nombre", usuario.getNombre() + " " + usuario.getApellido());
            item.put("descripcion", a.getNombre() != null ? a.getNombre() : "realizó una actividad");
            item.put("tiempo", calcularTiempoRelativo(a.getFecha()));
            resultado.add(item);
            count++;
        }
        return resultado;
    }

    private String formatearMinutos(long minutos) {
        long horas = minutos / 60;
        long mins = minutos % 60;
        return horas + "h " + mins + "m";
    }

    private String calcularTiempoRelativo(LocalDateTime fecha) {
        if (fecha == null) return "";
        long minutos = ChronoUnit.MINUTES.between(fecha, LocalDateTime.now());
        if (minutos < 1) return "hace unos segundos";
        if (minutos < 60) return "hace " + minutos + " min";
        long horas = minutos / 60;
        if (horas < 24) return "hace " + horas + " h";
        long dias = horas / 24;
        return "hace " + dias + " días";
    }
}