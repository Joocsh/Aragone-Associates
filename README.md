# Workflow Creator - Generador Automático de Flujos

Una aplicación web moderna y minimalista para crear diagramas de flujo de trabajo automáticamente solo escribiendo el proceso en texto simple, sin necesidad de arrastrar bloques.

## Características

✨ **Generación automática** - Escribe tu proceso y los diagramas se generan en tiempo real  
📝 **Sintaxis simple** - Estructura clara y fácil de aprender  
🎨 **Diseño minimalista** - Interfaz elegante y enfocada  
🔄 **Ramificaciones** - Soporte para decisiones y flujos alternativos  
📱 **Responsive** - Funciona en desktop y tablets  

## Inicio Rápido

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Ejecutar en desarrollo
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### 3. Usar la aplicación

**Acciones** - Escribe pasos con la estructura `Paso: `
```
Paso: Recibir solicitud
Paso: Validar datos
Paso: Guardar en BD
```

**Decisiones** - Escribe preguntas con `¿...?`
```
¿Datos válidos?
```

**Ramificaciones** - Usa indentación para agregar opciones Si/Si no
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

## Estructura del Proyecto

```
app/
├── page.tsx           # Página principal
└── layout.tsx         # Layout global

components/
├── workflow-editor.tsx    # Editor de texto
├── workflow-canvas.tsx    # Visualización del flujo
└── custom-nodes/
    ├── action-node.tsx    # Nodos de acción (rectángulos)
    └── decision-node.tsx  # Nodos de decisión (diamantes)

lib/
└── parser.ts          # Lógica de parsing de texto
```

## Stack Técnico

- **Next.js 16** - Framework de React
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos
- **React Flow** - Visualización de diagramas
- **shadcn/ui** - Componentes base

## Cómo Funciona

1. **Parser** (`lib/parser.ts`) - Convierte el texto en nodos y conexiones
2. **Editor** - Captura el input del usuario con debounce de 300ms
3. **Canvas** - Renderiza el diagrama usando React Flow
4. **Nodos** - Componentes personalizados para acciones y decisiones

## Limitaciones Actuales

- Workflows pequeños a moderados (hasta ~20 pasos)
- Sin persistencia (datos se pierden al recargar)
- Sin exportación a otros formatos

## Próximas Mejoras

- Guardar workflows en base de datos
- Exportar a imagen (PNG/SVG)
- Más tipos de nodos (loops, acciones paralelas)
- Editor visual adicional para ajustes

## Desarrollo

Para compilar para producción:
```bash
pnpm build
pnpm start
```

## Contacto & Soporte

Documentación completa en `USAGE.md`

---

Creado con ❤️ usando v0 by Vercel
