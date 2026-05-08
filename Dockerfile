# Usar una imagen oficial de Node.js como base
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias (solo las de producción si estuviéramos en prod, pero instalamos todas para desarrollo)
RUN npm install && npm install -g nodemon

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
