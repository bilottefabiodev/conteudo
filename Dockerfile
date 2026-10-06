FROM nginx:alpine

# Copia os arquivos da página estática para a pasta padrão do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
