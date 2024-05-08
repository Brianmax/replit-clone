# Replit clone

Clon de replit:
- Backend: Node.js, Express
- Frontend: React.js, Monaco Editor
- Database: MongoDB

## Features
- Crear, editar, borrar y compartir proyectos

## Instalación en Google Cloud

Primero debemos de tener en cuenta que necesitamos un cluster GKE en Google Cloud, una vez que tengamos el cluster, debemos de instalar el cliente de Google Cloud en nuestra máquina local.

```bash
gcloud init
```

Una vez que tengamos el cliente de Google Cloud instalado, debemos de configurar el contexto de nuestro cluster.

```bash

gcloud container clusters get-credentials <nombre-cluster> --zone <zona-cluster>

```

Una vez que tengamos el contexto configurado, debemos de crear una imagen de Docker de nuestro backend y frontend.

Primero debemos de crear un archivo Dockerfile en la raíz de nuestro proyecto backend.

```Dockerfile
FROM --platform=linux/amd64 node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]
```

La imagen debe tener como nombre el siguiente formato: `<zone>-docker.pkg.dev/<id_proyecto>/<repositorio_docker>/<nombre_contenedor>:<tag>`

```bash
docker build -t <nombre_imagen> .
```

Una vez que tengamos la imagen de nuestro backend, debemos de subirla a Google Cloud.

```bash
docker push <nombre_imagen>
```

Lo mismo debemos de hacer con el frontend.

Una vez tengamos las imágenes de nuestro backend y frontend en Google Cloud, debemos de crear un archivo de configuración de Kubernetes.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node2
  labels:
    name: node2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node2
  template:
    metadata:
      labels:
        app: node2
    spec:
      containers:
      - name: node2
        image: us-east1-docker.pkg.dev/unified-hull-414821/final-docker/final-backend-kubernetes
        env:
        - name: NODE_ENV
          value: "development"
        - name: PORT
          value: "3000"
      restartPolicy: Always

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: node2
  labels:
    name: node2
spec:
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: node2
```
Para crear el deployment en Kubernetes, debemos de ejecutar el siguiente comando:
```bash

kubectl apply -f <nombre_archivo>.yaml

```

Una vez que tengamos el deployment creado, debemos de exponer el servicio.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node2
  labels:
    service: node2
spec:
  selector:
    app: node2
  type: LoadBalancer
  ports:
    - port: 3000
```

Para crear el servicio en Kubernetes, debemos de ejecutar el siguiente comando:

```bash

kubectl apply -f <nombre_archivo>.yaml

```
Este comando nos devolverá la dirección IP de nuestro servicio, la cual podemos utilizar para acceder a nuestra aplicación.