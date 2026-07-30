package com.proyectofinal.eq16.dto;

import java.util.List;
import java.util.Map;

public class DashboardResponse {

    private Map<String, Object> usuario;
    private Map<String, Object> metricasHoy;
    private List<Map<String, Object>> productividadSemanal;
    private Map<String, Object> pomodoroCompacto;
    private List<Map<String, Object>> tareasPrioritarias;
    private List<Map<String, Object>> actividadReciente;

    public Map<String, Object> getUsuario() { return usuario; }
    public void setUsuario(Map<String, Object> usuario) { this.usuario = usuario; }
    public Map<String, Object> getMetricasHoy() { return metricasHoy; }
    public void setMetricasHoy(Map<String, Object> metricasHoy) { this.metricasHoy = metricasHoy; }
    public List<Map<String, Object>> getProductividadSemanal() { return productividadSemanal; }
    public void setProductividadSemanal(List<Map<String, Object>> productividadSemanal) { this.productividadSemanal = productividadSemanal; }
    public Map<String, Object> getPomodoroCompacto() { return pomodoroCompacto; }
    public void setPomodoroCompacto(Map<String, Object> pomodoroCompacto) { this.pomodoroCompacto = pomodoroCompacto; }
    public List<Map<String, Object>> getTareasPrioritarias() { return tareasPrioritarias; }
    public void setTareasPrioritarias(List<Map<String, Object>> tareasPrioritarias) { this.tareasPrioritarias = tareasPrioritarias; }
    public List<Map<String, Object>> getActividadReciente() { return actividadReciente; }
    public void setActividadReciente(List<Map<String, Object>> actividadReciente) { this.actividadReciente = actividadReciente; }
}