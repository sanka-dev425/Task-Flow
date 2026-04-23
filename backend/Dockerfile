FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY src/TaskFlow.Api/TaskFlow.Api.csproj ./src/TaskFlow.Api/
RUN dotnet restore src/TaskFlow.Api/TaskFlow.Api.csproj

# Copy everything and build
COPY . .
RUN dotnet publish src/TaskFlow.Api/TaskFlow.Api.csproj -c Release -o /app/out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

ENTRYPOINT ["dotnet", "TaskFlow.Api.dll"]
