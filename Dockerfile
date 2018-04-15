# Elige la imagen de Ubuntu
FROM ubuntu:trusty

# Autor
MAINTAINER Hernan Arena

# Instalar Node.js y algunas dependencias
RUN apt-get update && \
	apt-get -y install curl && \
	curl -sL https://deb.nodesource.com/setup_6.x | sudo bash - && \
	apt-get -y install python build-essential nodejs

# Pasa módulos de node (node_modules) para caché
ADD package.json /src/package.json

# Elige el directorio de trabajo
WORKDIR /src

<<<<<<< HEAD:Dockerfile
=======
# definimos el puerto 8080
EXPOSE 8080

>>>>>>> origin/master:Dockerfile
# Instala dependencias
RUN npm install

# Copia del directorio donde está el código al directorio dentro
# del container donde se va a ejecutar
COPY [".", "/src"]

# Ejecuta la aplicación con el parámetro
<<<<<<< HEAD:Dockerfile
CMD ["node", "/src/servidor.js"]
=======
CMD ["node", "/src/servidor/servidor.js"]
>>>>>>> origin/master:Dockerfile
