// Ejecutar con node setupData.js o npm run setup-data
const fetch = require('node-fetch');

// Configuración del token de autenticación
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGd1aWVuQGZpLnViYS5hciIsImlhdCI6MTc2NDg2NTA1OSwiZXhwIjoxNzY0ODcyMjU5fQ.sOv-eb8stBZ0xrcXu-_j46ZjzzGXna2epKoKAxr1T1w";
const BASE_URL = "http://localhost:8080";

// Función para hacer requests autenticadas
async function apiFetch(url, options = {}) {
  const fetch = (await import('node-fetch')).default;

  const headers = {
    ...(options.headers || {}),
    "Authorization": `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    "accept": "*/*"
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Datos de las materias a crear
const subjectsData = [
  {
    "code": "75.01",
    "name": "Algoritmos y Programación I",
    "department": "Computación"
  },
  {
    "code": "75.02",
    "name": "Algoritmos y Programación II",
    "department": "Computación"
  },
  {
    "code": "75.03",
    "name": "Algoritmos y Programación III",
    "department": "Computación"
  },
  {
    "code": "75.04",
    "name": "Matemática Discreta",
    "department": "Computación"
  },
  {
    "code": "75.05",
    "name": "Análisis Matemático II",
    "department": "Matemática"
  },
  {
    "code": "75.06",
    "name": "Álgebra Lineal",
    "department": "Matemática"
  },
  {
    "code": "75.07",
    "name": "Física I",
    "department": "Física"
  },
  {
    "code": "75.08",
    "name": "Química",
    "department": "Química"
  },
  {
    "code": "75.09",
    "name": "Ingeniería de Software I",
    "department": "Computación"
  },
  {
    "code": "75.10",
    "name": "Base de Datos",
    "department": "Computación"
  },
  {
    "code": "75.11",
    "name": "Sistemas Operativos",
    "department": "Computación"
  },
  {
    "code": "75.12",
    "name": "Redes de Computadoras",
    "department": "Computación"
  },
  {
    "code": "75.13",
    "name": "Inteligencia Artificial",
    "department": "Computación"
  },
  {
    "code": "75.14",
    "name": "Teoría de la Computación",
    "department": "Computación"
  },
  {
    "code": "75.15",
    "name": "Gestión de Proyectos",
    "department": "Computación"
  }
];

// Profesores simulados para las cátedras
const professors = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez",
  "Sánchez", "Pérez", "Gómez", "Martin", "Ruiz", "Hernández", "Jiménez",
  "Díaz", "Moreno", "Álvarez", "Romero", "Navarro", "Torres", "Gil"
];

// Función principal
async function setupData() {
  console.log("Iniciando configuración de datos...\n");

  try {
    // 1. Crear materias
    console.log("Creando materias...");
    const createdSubjects = [];

    for (const subject of subjectsData) {
      try {
        console.log(`   Creando materia: ${subject.name} (${subject.code})`);
        const result = await apiFetch(`${BASE_URL}/subjects`, {
          method: 'POST',
          body: JSON.stringify(subject)
        });
        createdSubjects.push(result);
        console.log(`   Materia creada: ${result.name} (${result.code})`);
      } catch (error) {
        console.log(`   Error creando materia ${subject.name}: ${error.message}`);
      }
    }

    console.log(`\nSe crearon ${createdSubjects.length} materias exitosamente\n`);

    // 2. Crear cursos para cada materia
    console.log("Creando cursos...");
    let coursesCreated = 0;

    for (const subject of createdSubjects) {
      // Crear 2-4 cursos por materia
      const numCourses = Math.floor(Math.random() * 3) + 2; // 2-4 cursos

      for (let i = 0; i < numCourses; i++) {
        const professor = professors[Math.floor(Math.random() * professors.length)];
        const courseData = {
          "commission": professor,
          "active": true,
          "subjectCode": subject.code
        };

        try {
          console.log(`   Creando curso: ${subject.name} - ${professor}`);
          const result = await apiFetch(`${BASE_URL}/courses`, {
            method: 'POST',
            body: JSON.stringify(courseData)
          });
          coursesCreated++;
          console.log(`   ✅ Curso creado: ${subject.name} - ${result.commission} (ID: ${result.id})`);
        } catch (error) {
          console.log(`   Error creando curso ${subject.name} - ${professor}: ${error.message}`);
        }

        // Pequeña pausa para no sobrecargar el servidor
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\nSe crearon ${coursesCreated} cursos exitosamente`);
    console.log("\n¡Configuración completada!");

  } catch (error) {
    console.error("Error general:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
if (require.main === module) {
  setupData();
}

module.exports = { setupData, apiFetch };
