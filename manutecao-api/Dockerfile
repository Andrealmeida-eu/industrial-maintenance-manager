# ==========================================
# ESTÁGIO 1: BUILD (Compilação com Maven)
# ==========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

# Define a pasta de trabalho dentro do container de build
WORKDIR /app

# Copia o arquivo pom.xml primeiro (Isso otimiza o cache do Docker)
COPY ./barber/pom.xml .

# Copia todo o código-fonte (pasta src) para dentro do container
COPY ./barber/src ./src

# Executa o Maven para compilar o projeto e gerar o .jar
RUN mvn clean package -DskipTests

# ==========================================
# ESTÁGIO 2: EXECUÇÃO (Imagem final leve)
# ==========================================
FROM eclipse-temurin:17-jre-alpine

# Define a pasta de trabalho final
WORKDIR /app

# Copia APENAS o .jar gerado lá no Estágio 1 (builder) para esta imagem
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta do Spring Boot
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]                             