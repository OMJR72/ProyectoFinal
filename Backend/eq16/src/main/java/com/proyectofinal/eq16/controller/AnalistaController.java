package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.models.Sesion;
import com.proyectofinal.eq16.models.Tarea;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.UsuarioRepository;
import com.proyectofinal.eq16.service.ActividadService;
import com.proyectofinal.eq16.service.SesionService;
import com.proyectofinal.eq16.service.TareaService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analista")
public class AnalistaController {

    private final UsuarioRepository usuarioRepository;
    private final TareaService tareaService;
    private final SesionService sesionService;
    private final ActividadService actividadService;

    public AnalistaController(UsuarioRepository usuarioRepository, TareaService tareaService,
                              SesionService sesionService, ActividadService actividadService) {
        this.usuarioRepository = usuarioRepository;
        this.tareaService = tareaService;
        this.sesionService = sesionService;
        this.actividadService = actividadService;
    }

    @GetMapping("/reportes")
    public ResponseEntity<Map<String, Object>> reportes() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Tarea> todasLasTareas = tareaService.listar();
        List<Sesion> todasLasSesiones = sesionService.listar();

        Map<String, Object> response = new HashMap<>();

        response.put("totalUsuarios", usuarios.size());
        response.put("totalTareas", todasLasTareas.size());
        response.put("totalSesiones", todasLasSesiones.size());

        long tareasCompletadas = todasLasTareas.stream().filter(t -> "COMPLETADA".equals(t.getEstado())).count();
        long tareasPendientes = todasLasTareas.stream().filter(t -> "PENDIENTE".equals(t.getEstado())).count();
        long tareasEnProgreso = todasLasTareas.stream().filter(t -> "EN_PROGRESO".equals(t.getEstado())).count();

        Map<String, Object> tareasPorEstado = new HashMap<>();
        tareasPorEstado.put("completadas", tareasCompletadas);
        tareasPorEstado.put("pendientes", tareasPendientes);
        tareasPorEstado.put("enProgreso", tareasEnProgreso);
        response.put("tareasPorEstado", tareasPorEstado);

        long totalMinutos = todasLasSesiones.stream()
                .mapToLong(s -> s.getDuracion_minutos() != null ? s.getDuracion_minutos() : 0L)
                .sum();
        response.put("totalHorasEstudio", totalMinutos / 60.0);

        long sesionesHoy = todasLasSesiones.stream()
                .filter(s -> s.getFecha_inicio() != null && s.getFecha_inicio().toLocalDate().equals(LocalDate.now()))
                .count();
        response.put("sesionesHoy", sesionesHoy);

        LocalDate semanaInicio = LocalDate.now().minusDays(6);
        long sesionesSemana = todasLasSesiones.stream()
                .filter(s -> s.getFecha_inicio() != null && !s.getFecha_inicio().toLocalDate().isBefore(semanaInicio))
                .count();
        response.put("sesionesEstaSemana", sesionesSemana);

        List<Map<String, Object>> topUsuarios = usuarios.stream()
                .sorted((a, b) -> Long.compare(b.getPuntos() != null ? b.getPuntos() : 0L, a.getPuntos() != null ? a.getPuntos() : 0L))
                .limit(10)
                .map(u -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", u.getId());
                    item.put("nombre", u.getNombre() + " " + u.getApellido());
                    item.put("email", u.getEmail());
                    item.put("rol", u.getRol().getNombre());
                    item.put("puntos", u.getPuntos());
                    item.put("fechaRegistro", u.getFecha_registro());
                    return item;
                })
                .collect(Collectors.toList());
        response.put("topUsuarios", topUsuarios);

        List<Map<String, Object>> actividadReciente = actividadService.listar().stream()
                .sorted((a, b) -> b.getFecha().compareTo(a.getFecha()))
                .limit(10)
                .map(a -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", a.getId_actividad());
                    item.put("nombre", a.getNombre());
                    item.put("descripcion", a.getDescripcion());
                    item.put("fecha", a.getFecha());
                    return item;
                })
                .collect(Collectors.toList());
        response.put("actividadReciente", actividadReciente);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<Map<String, Object>>> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Usuario u : usuarios) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", u.getId());
            item.put("nombre", u.getNombre() + " " + u.getApellido());
            item.put("email", u.getEmail());
            item.put("rol", u.getRol().getNombre());
            item.put("puntos", u.getPuntos());
            item.put("fechaRegistro", u.getFecha_registro());

            List<Tarea> tareas = tareaService.listarPorUsuario(u.getId());
            long completadas = tareas.stream().filter(t -> "COMPLETADA".equals(t.getEstado())).count();
            item.put("tareasCompletadas", completadas);
            item.put("totalTareas", tareas.size());

            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/exportar/tareas")
    public ResponseEntity<String> exportarTareasCSV() {
        List<Tarea> tareas = tareaService.listar();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Título,Descripción,Prioridad,Estado,Fecha Límite,Usuario\n");
        for (Tarea t : tareas) {
            String usuario = t.getUsuario() != null ? t.getUsuario().getEmail() : "";
            csv.append(t.getId_tarea()).append(",")
                    .append(escaparCSV(t.getTitulo())).append(",")
                    .append(escaparCSV(t.getDescripcion())).append(",")
                    .append(escaparCSV(t.getPrioridad())).append(",")
                    .append(escaparCSV(t.getEstado())).append(",")
                    .append(t.getFecha_limite() != null ? t.getFecha_limite() : "").append(",")
                    .append(escaparCSV(usuario)).append("\n");
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tareas.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.toString());
    }

    @GetMapping("/exportar/sesiones")
    public ResponseEntity<String> exportarSesionesCSV() {
        List<Sesion> sesiones = sesionService.listar();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Usuario,Fecha Inicio,Fecha Fin,Duración (min),Estado\n");
        for (Sesion s : sesiones) {
            String usuario = s.getUsuario() != null ? s.getUsuario().getEmail() : "";
            csv.append(s.getId_sesion()).append(",")
                    .append(escaparCSV(usuario)).append(",")
                    .append(s.getFecha_inicio() != null ? s.getFecha_inicio() : "").append(",")
                    .append(s.getFecha_fin() != null ? s.getFecha_fin() : "").append(",")
                    .append(s.getDuracion_minutos() != null ? s.getDuracion_minutos() : "").append(",")
                    .append(escaparCSV(s.getEstado())).append("\n");
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sesiones.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.toString());
    }

    private String escaparCSV(String valor) {
        if (valor == null) return "";
        if (valor.contains(",") || valor.contains("\"") || valor.contains("\n")) {
            return "\"" + valor.replace("\"", "\"\"") + "\"";
        }
        return valor;
    }
}
