# Render deploys via Docker (no native Java runtime on Render)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Must be exact name — COPY target/*.jar fails when .jar.original also exists
COPY --from=build /app/target/hospital-management-api-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Container-friendly memory settings for Render free tier (~512MB)
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
