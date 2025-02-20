FROM amazoncorretto:17-alpine-jdk

COPY target/urbia-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]


# FROM maven:3.8.6-openjdk-11 AS build
# WORKDIR /app
# COPY . .
# RUN mvn clean package -DskipTests

# FROM openjdk:11-jre-slim
# WORKDIR /app
# COPY --from=build /app/target/*.jar app.jar
# COPY --from=build /app/src/main/resources/my-service-account-key.json /app/keys/

# ENV GOOGLE_APPLICATION_CREDENTIALS=/app/keys/my-service-account-key.json

# CMD ["java", "-jar", "app.jar"]



##para ejecutarlo
#   docker build -t gcs-app .
#   docker run -it --rm gcs-app