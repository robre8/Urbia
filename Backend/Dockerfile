#FROM amazoncorretto:17-alpine-jdk

#COPY target/urbia-0.0.1-SNAPSHOT.jar app.jar

#ENTRYPOINT ["java", "-jar", "/app.jar"]

# Etapa de build
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package

# Etapa de producción
FROM amazoncorretto:17-alpine-jdk
COPY --from=build /app/target/urbia-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
