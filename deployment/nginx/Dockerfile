FROM nginx

WORKDIR /app

RUN mkdir log

COPY deployment/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
