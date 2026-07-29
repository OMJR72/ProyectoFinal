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
    rol_id BIGINT NOT NULL,
    fecha_registro DATE NOT NULL,
    puntos BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES rol(rol_id)
);

CREATE TABLE tareas (
    id_tarea BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    descripcion TEXT,
    fecha_Creacion DATE,
    fecha_limite DATE,
    estado BOOLEAN,
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
    estado BOOLEAN,
    usuario_id BIGINT,

    CONSTRAINT fk_sesion_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);