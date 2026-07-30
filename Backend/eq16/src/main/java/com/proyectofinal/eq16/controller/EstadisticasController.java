package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.dto.EstadisticasResponse;
import com.proyectofinal.eq16.models.Sesion;
import com.proyectofinal.eq16.models.Tarea;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.security.UsuarioContext;
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
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticasController {

    private final UsuarioContext usuarioContext;
    private final SesionService sesionService;
    private final TareaService tareaService;

    public EstadisticasController(UsuarioContext usuarioContext, SesionService sesionService,
                                   TareaService tareaService) {
        this.usuarioContext = usuarioContext;
        this.sesionService = sesionService;
        this.tareaService = tareaService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<EstadisticasResponse> resumen() {
        Usuario usuario = usuarioContext.getCurrentUser();
        EstadisticasResponse response = new EstadisticasResponse();

        response.setKpis(calcularKpis(usuario));
        response.setProductividadSemanal(calcularProductividadSemanal(usuario));
        response.setDistribucionCategoria(calcularDistribucionCategoria());
        response.setDistribucionProyecto(calcularDistribucionProyecto(usuario));

        return ResponseEntity.ok(response);
    }

    private List<Map<String, Object>> calcularKpis(Usuario usuario) {
        Long userId = usuario.getId();
        List<Sesion> sesiones = sesionService.listarPorUsuario(userId);
        long totalMinutos = sesiones.stream()
                .mapToLong(s -> s.getDuracion_minutos() != null ? s.getDuracion_minutos() : 0L)
                .sum();
        long totalHoras = totalMinutos / 60;
        long totalMins = totalMinutos % 60;
        String horasStr = totalHoras + "h " + totalMins + "m";

        long sesionesCount = sesiones.size();
        long tareasCompletadas = tareaService.contarCompletadasPorUsuario(userId);

        List<Map<String, Object>> kpis = new ArrayList<>();
        kpis.add(crearKpi("Horas Totales", horasStr));
        kpis.add(crearKpi("Sesiones Pomodoro", String.valueOf(sesionesCount)));
        kpis.add(crearKpi("Tareas Finalizadas", String.valueOf(tareasCompletadas)));
        kpis.add(crearKpi("Racha Actual", "0 Días"));

        return kpis;
    }

    private Map<String, Object> crearKpi(String etiqueta, String valor) {
        Map<String, Object> kpi = new HashMap<>();
        kpi.put("id", etiqueta.hashCode());
        kpi.put("etiqueta", etiqueta);
        kpi.put("valor", valor);
        return kpi;
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

    private List<Map<String, Object>> calcularDistribucionCategoria() {
        List<Map<String, Object>> categorias = new ArrayList<>();
        categorias.add(crearCategoria("Desarrollo", 45));
        categorias.add(crearCategoria("Diseño UI/UX", 30));
        categorias.add(crearCategoria("Documentación", 15));
        categorias.add(crearCategoria("Otros", 10));
        return categorias;
    }

    private Map<String, Object> crearCategoria(String categoria, int porcentaje) {
        Map<String, Object> item = new HashMap<>();
        item.put("categoria", categoria);
        item.put("porcentaje", porcentaje);
        return item;
    }

    private List<Map<String, Object>> calcularDistribucionProyecto(Usuario usuario) {
        Long userId = usuario.getId();
        List<Sesion> sesiones = sesionService.listarPorUsuario(userId);
        long totalSesiones = sesiones.size();
        long totalMinutos = sesiones.stream()
                .mapToLong(s -> s.getDuracion_minutos() != null ? s.getDuracion_minutos() : 0L)
                .sum();
        long totalHoras = totalMinutos / 60;
        String horasStr = totalHoras + "h";

        List<Tarea> tareas = tareaService.listarPorUsuario(userId);
        long noCompletadas = tareas.stream().filter(t -> !"COMPLETADA".equals(t.getEstado())).count();
        long completadas = tareas.size() - noCompletadas;
        int meta = tareas.isEmpty() ? 100 : (int) (completadas * 100 / tareas.size());

        List<Map<String, Object>> proyectos = new ArrayList<>();
        Map<String, Object> proyecto = new HashMap<>();
        proyecto.put("proyecto", "Synapse");
        proyecto.put("horas", horasStr);
        proyecto.put("sesiones", (int) totalSesiones);
        proyecto.put("meta", meta + "%");
        proyectos.add(proyecto);

        return proyectos;
    }
}