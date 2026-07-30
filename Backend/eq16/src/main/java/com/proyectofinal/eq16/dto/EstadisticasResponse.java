package com.proyectofinal.eq16.dto;

import java.util.List;
import java.util.Map;

public class EstadisticasResponse {

    private List<Map<String, Object>> kpis;
    private List<Map<String, Object>> productividadSemanal;
    private List<Map<String, Object>> distribucionCategoria;
    private List<Map<String, Object>> distribucionProyecto;

    public List<Map<String, Object>> getKpis() { return kpis; }
    public void setKpis(List<Map<String, Object>> kpis) { this.kpis = kpis; }
    public List<Map<String, Object>> getProductividadSemanal() { return productividadSemanal; }
    public void setProductividadSemanal(List<Map<String, Object>> productividadSemanal) { this.productividadSemanal = productividadSemanal; }
    public List<Map<String, Object>> getDistribucionCategoria() { return distribucionCategoria; }
    public void setDistribucionCategoria(List<Map<String, Object>> distribucionCategoria) { this.distribucionCategoria = distribucionCategoria; }
    public List<Map<String, Object>> getDistribucionProyecto() { return distribucionProyecto; }
    public void setDistribucionProyecto(List<Map<String, Object>> distribucionProyecto) { this.distribucionProyecto = distribucionProyecto; }
}