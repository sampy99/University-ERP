# backend/Dockerfile
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /workspace

# copy pom & mvn wrapper first to leverage docker cache
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw ./
# copy source
COPY src ./src

RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
