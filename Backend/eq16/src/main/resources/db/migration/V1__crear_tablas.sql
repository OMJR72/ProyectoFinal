CREATE TABLE rol (
    rol_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol_id BIGINT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntos BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES rol(rol_id)
);

CREATE TABLE tareas (
    id_tarea BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATE,
    prioridad VARCHAR(20) DEFAULT 'MEDIA',
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    id_usuario BIGINT,

    CONSTRAINT fk_tarea_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
);

CREATE TABLE sesiones (
    sesion_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    duracion_minutos BIGINT,
    estado VARCHAR(20) DEFAULT 'EN_PROGRESO',
    id_usuario BIGINT,

    CONSTRAINT fk_sesion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
);

CREATE TABLE actividades (
    id_actividad BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(20) DEFAULT 'OTRA',
    id_sesion BIGINT NOT NULL,

    CONSTRAINT fk_actividad_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesiones(sesion_id)
);
