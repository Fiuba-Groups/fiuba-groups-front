const fetch = require('node-fetch');

// Configuración base
const BASE_URL = "http://localhost:8080";

// Función para hacer requests HTTP
async function apiFetch(url, options = {}) {
  const fetch = (await import('node-fetch')).default;

  const headers = {
    ...(options.headers || {}),
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

// Función para hacer requests autenticadas
async function authenticatedFetch(url, token, options = {}) {
  const fetch = (await import('node-fetch')).default;

  const headers = {
    ...(options.headers || {}),
    "Authorization": `Bearer ${token}`,
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

// Datos de estudiantes a crear (con emails únicos usando timestamp)
const timestamp = Date.now();
const studentsData = [
  {
    email: `juan.perez${timestamp}@fi.uba.ar`,
    password: "Password123!",
    firstName: "Juan",
    lastName: "Pérez"
  },
  {
    email: `maria.garcia${timestamp}@fi.uba.ar`,
    password: "SecurePass456!",
    firstName: "María",
    lastName: "García"
  },
  {
    email: `carlos.rodriguez${timestamp}@fi.uba.ar`,
    password: "MyPass789!",
    firstName: "Carlos",
    lastName: "Rodríguez"
  },
  {
    email: `ana.martinez${timestamp}@fi.uba.ar`,
    password: "StrongPass101!",
    firstName: "Ana",
    lastName: "Martínez"
  },
  {
    email: `luis.fernandez${timestamp}@fi.uba.ar`,
    password: "SafePass202!",
    firstName: "Luis",
    lastName: "Fernández"
  },
  {
    email: `sofia.lopez${timestamp}@fi.uba.ar`,
    password: "GreatPass303!",
    firstName: "Sofía",
    lastName: "López"
  },
  {
    email: `diego.gonzalez${timestamp}@fi.uba.ar`,
    password: "GoodPass404!",
    firstName: "Diego",
    lastName: "González"
  },
  {
    email: `valentina.sanchez${timestamp}@fi.uba.ar`,
    password: "BestPass505!",
    firstName: "Valentina",
    lastName: "Sánchez"
  }
];

// Títulos y descripciones realistas para grupos
const groupTemplates = [
  {
    title: "Grupo de práctica Algoritmos I",
    description: "Busco compañeros para practicar algoritmos y estructuras de datos. Nos juntamos 2 veces por semana para resolver ejercicios del Raggi. Ideal para quienes quieren reforzar conceptos básicos."
  },
  {
    title: "Estudio Álgebra Lineal",
    description: "Formamos grupo para algebra lineal. Examen final se acerca y necesitamos organizarnos. Alguien que haya cursado antes sería genial para coordinar."
  },
  {
    title: "Proyecto Programación II",
    description: "Necesito compañeros para el proyecto final de POO. Busco gente comprometida que sepa Java. Preferiblemente que hayan aprobado Algoritmos I."
  },
  {
    title: "Repaso Análisis Matemático",
    description: "Grupo de estudio para el parcial de análisis. Nos enfocamos en límites, derivadas e integrales. Tengo apuntes de clases anteriores."
  },
  {
    title: "Base de Datos - Trabajo Práctico",
    description: "Buscamos completar el TP de BD. Ya tenemos algunas tablas diseñadas, necesitamos ayuda con las consultas complejas y normalización."
  },
  {
    title: "Física I - Problemas y Teoría",
    description: "Grupo mixto teoría y problemas de Física I. Nos reunimos los miércoles después de clase. Traigan calculadora científica."
  },
  {
    title: "Redes de Computadoras",
    description: "Estudiamos redes para el final. Alguien que sepa de protocolos TCP/IP sería de gran ayuda. Practicamos con Packet Tracer."
  },
  {
    title: "Ingeniería de Software",
    description: "Grupo para el proyecto de IS. Vamos a usar metodologías ágiles. Busco desarrolladores frontend y backend con experiencia."
  },
  {
    title: "Sistemas Operativos",
    description: "Repaso SO con énfasis en procesos, memoria y archivos. Tengo acceso a una VM con Linux para practicar comandos."
  },
  {
    title: "Inteligencia Artificial",
    description: "Grupo avanzado de IA. Estudiamos machine learning y redes neuronales. Proyecto final de clasificación de imágenes."
  },
  {
    title: "Teoría de la Computación",
    description: "Automatas, lenguajes y complejidad. Es una materia densa, necesitamos organizarnos bien para el final."
  },
  {
    title: "Matemática Discreta",
    description: "Lógica, conjuntos, grafos y combinatoria. Grupo pequeño y enfocado. Preferiblemente con conocimientos previos de matemática."
  }
];

// Función principal
async function setupGroups() {
  console.log("🚀 Iniciando configuración de estudiantes y grupos...\n");

  try {
    // 1. Registrar estudiantes
    console.log("👥 Registrando estudiantes...");
    const registeredStudents = [];

    for (const student of studentsData) {
      try {
        console.log(`   Registrando: ${student.firstName} ${student.lastName} (${student.email})`);
        const result = await apiFetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          body: JSON.stringify(student)
        });

        // El registro devuelve información del estudiante incluyendo su ID
        registeredStudents.push({
          ...student,
          id: result.id || result.studentId || result.register || result.studentRegister, // Adaptar según la respuesta real
          token: null
        });

        console.log(`   ✅ Estudiante registrado: ${student.firstName} ${student.lastName}`);
      } catch (error) {
        console.log(`   ❌ Error registrando ${student.email}: ${error.message}`);
      }

      // Pequeña pausa
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✅ Se registraron ${registeredStudents.length} estudiantes exitosamente\n`);

    // 2. Login de estudiantes para obtener tokens
    console.log("🔐 Iniciando sesión de estudiantes...");
    const loggedInStudents = [];

    for (const student of registeredStudents) {
      try {
        console.log(`   Login: ${student.email}`);
        const loginResult = await apiFetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({
            email: student.email,
            password: student.password
          })
        });

        const studentWithToken = { ...student, token: loginResult.token };
        loggedInStudents.push(studentWithToken);

        console.log(`   ✅ Login exitoso: ${student.firstName} (Token obtenido)`);
      } catch (error) {
        console.log(`   ❌ Error en login ${student.email}: ${error.message}`);
      }

      // Pequeña pausa
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✅ ${loggedInStudents.length} estudiantes hicieron login exitosamente\n`);

    // 3. Crear ofertas de grupo
    console.log("📝 Creando ofertas de grupo...");
    let groupsCreated = 0;

    // IDs de cursos disponibles (49-91 basado en la ejecución anterior)
    const availableCourseIds = Array.from({length: 43}, (_, i) => 49 + i);

    for (let i = 0; i < Math.min(groupTemplates.length, loggedInStudents.length); i++) {
      const template = groupTemplates[i];
      const creator = loggedInStudents[i];
      const courseId = availableCourseIds[Math.floor(Math.random() * availableCourseIds.length)];
      const maxMembers = Math.floor(Math.random() * 8) + 3; // 3-10 miembros

      try {
        console.log(`   Creando grupo: "${template.title}" por ${creator.firstName}`);

        const groupData = {
          title: template.title,
          description: template.description,
          courseOfferingId: courseId,
          maxMembers: maxMembers,
          creatorStudentRegister: creator.id
        };

        const result = await authenticatedFetch(`${BASE_URL}/groups`, creator.token, {
          method: 'POST',
          body: JSON.stringify(groupData)
        });

        groupsCreated++;
        console.log(`   ✅ Grupo creado: "${result.title}" (ID: ${result.id}) - ${maxMembers} miembros max`);

      } catch (error) {
        console.log(`   ❌ Error creando grupo "${template.title}": ${error.message}`);
      }

      // Pequeña pausa
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Crear algunos grupos adicionales con estudiantes aleatorios
    console.log("\n📝 Creando grupos adicionales...");
    for (let i = 0; i < 8; i++) {
      const creator = loggedInStudents[Math.floor(Math.random() * loggedInStudents.length)];
      const template = groupTemplates[Math.floor(Math.random() * groupTemplates.length)];
      const courseId = availableCourseIds[Math.floor(Math.random() * availableCourseIds.length)];
      const maxMembers = Math.floor(Math.random() * 6) + 2; // 2-7 miembros

      // Crear título único agregando un número
      const uniqueTitle = `${template.title} ${i + 1}`;

      try {
        console.log(`   Creando grupo adicional: "${uniqueTitle}" por ${creator.firstName}`);

        const groupData = {
          title: uniqueTitle,
          description: template.description,
          courseOfferingId: courseId,
          maxMembers: maxMembers,
          creatorStudentRegister: creator.id
        };

        const result = await authenticatedFetch(`${BASE_URL}/groups`, creator.token, {
          method: 'POST',
          body: JSON.stringify(groupData)
        });

        groupsCreated++;
        console.log(`   ✅ Grupo adicional creado: "${result.title}" (ID: ${result.id})`);

      } catch (error) {
        console.log(`   ❌ Error creando grupo adicional: ${error.message}`);
      }

      // Pequeña pausa
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`\n✅ Se crearon ${groupsCreated} ofertas de grupo exitosamente`);
    console.log("\n🎉 ¡Configuración de estudiantes y grupos completada!");

  } catch (error) {
    console.error("❌ Error general:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
if (require.main === module) {
  setupGroups();
}

module.exports = { setupGroups, apiFetch, authenticatedFetch };
