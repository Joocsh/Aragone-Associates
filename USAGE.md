# Workflow Creator - Guía de Uso

## Bienvenido

Workflow Creator es una aplicación minimalista para generar diagramas de flujo automáticamente solo escribiendo el proceso en texto simple.

## Sintaxis

### Acciones (Bloques rectangulares)
Escribe `Paso:` seguido de la descripción:

```
Paso: Recibir solicitud
Paso: Validar datos
Paso: Guardar en base de datos
```

### Decisiones (Bloques en forma de diamante)
Escribe una pregunta entre signos de interrogación:

```
¿Datos válidos?
¿El usuario existe?
¿Cuenta activa?
```

### Ramificaciones
Use indentación (espacios) para agregar ramificaciones después de una decisión:

```
¿Datos válidos?
  Si: Procesar solicitud
  Si no: Mostrar error
```

## Ejemplo Completo

```
Paso: Recibir solicitud
¿Datos válidos?
  Si: Procesar solicitud
  Si no: Mostrar error
Paso: Guardar en base de datos
¿Guardado exitosamente?
  Si: Enviar confirmación
  Si no: Reintentar
Paso: Fin
```

## Características

- **En tiempo real**: El diagrama se genera mientras escribes
- **Minimalista**: Interfaz limpia y enfocada
- **Automático**: No necesitas arrastrar bloques ni organizar manualmente
- **Responsive**: Funciona en desktop y tablets

## Consejos

1. Usa descripciones claras y concisas en los pasos
2. Las preguntas deben terminar con `?`
3. Use indentación consistente (2 espacios por nivel)
4. El flujo se conecta automáticamente en el orden que escribes

## Limitaciones Actuales

- Workflows simples a moderados (hasta ~20 pasos)
- No hay persistencia (los datos se pierden al recargar)
- No hay exportación a otros formatos

## Próximas Mejoras

- Guardar workflows
- Exportar a imagen
- Más tipos de nodos (loops, paralelo)
- Editor visual adicional
