# ---- Stage 1: Build ----
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (cache layer)
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Descargar dependencias sin compilar el código fuente
RUN ./mvnw dependency:go-offline -B

# Copiar fuente y compilar
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:17-jre-jammy AS runtime

WORKDIR /app

# Usuario no-root por seguridad
RUN groupadd -r spring && useradd -r -g spring spring

# Copiar JAR desde stage de build
COPY --from=builder /app/target/*.jar app.jar

RUN chown spring:spring app.jar

USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
