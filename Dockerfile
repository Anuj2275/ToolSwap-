FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw clean package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]


#the below one is old, the above is generated from AI(bec, cause some issues in older one)
## Build stage
#FROM maven:3.9-eclipse-temurin-17 AS build
#WORKDIR /app
#COPY .mvn/ .mvn
#COPY mvnw pom.xml ./
#RUN chmod +x ./mvnw
#RUN ./mvnw dependency:go-offline
#COPY src ./src
##RUN #./mvnw clean package -DskipTests
#RUN ./mvnw clean package -Dmaven.test.skip=true
#
## Runtime stage
#FROM eclipse-temurin:17-jre-focal
#WORKDIR /app
#COPY --from=build /app/target/toolswap-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "app.jar"]
