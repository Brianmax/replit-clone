# Replit clone

Clon de replit:
- Backend: Node.js, Express
- Frontend: React.js, Monaco Editor
- Database: MongoDB

## Features
- Crear, editar, borrar y compartir proyectos

## Despliegue backend en Google Cloud

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


## Despliegue base de datos en Google Cloud

Creamos un volumen persistente en Google Cloud.

```yaml
gcloud compute disks create --size=10GB --zone=us-central1-a mongodb-disk
```

Creamos un archivo de configuración de Kubernetes para nuestro volumen persistente.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mongo-pv2
  labels:
    name: mongo-pv2
spec:
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteOnce
  gcePersistentDisk:
    pdName: mongo-data-disk
    fsType: ext4
```
Creamos un archivo claim para nuestro volumen persistente

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongo-pvc2
  labels:
    type: local
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 50Gi
  volumeName: mongo-pv2
```

Este archivo nos permite hacer un claim de nuestro volumen persistente.

Ejecutamos el siguiente comando para el volumen persistente.

```bash
kubectl apply -f volume.yaml
```

Ejecutamos el siguiente comando para el claim.

```bash

kubectl apply -f volume_claim.yaml

```

Creamos un archivo de configuración de Kubernetes para nuestro servicio de base de datos.

```yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo2
  labels:
    name: database
spec:
  replicas: 1
  selector:
    matchLabels:
      service: mongo2
  template:
    metadata:
      labels:
        service: mongo2
    spec:
      containers:
      - name: mongo2
        image: mongo:latest
        volumeMounts:
        - name: mongo-volume-mount
          mountPath: /data/db
      restartPolicy: Always
      volumes:
      - name: mongo-volume-mount
        persistentVolumeClaim:
          claimName: mongo-pvc2
```

Ejecutamos el siguiente comando para el deployment de la base de datos.

```bash

kubectl apply -f mongo_deployment.yaml

```

Creamos un archivo de configuración de Kubernetes para nuestro servicio de base de datos.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongo
  labels:
    service: mongo
spec:
  selector:
    service: mongo
  type: ClusterIP
  ports:
  - port: 5432
```

Ejecutamos el siguiente comando para el servicio de la base de datos.

```bash

kubectl apply -f mongo_service.yaml

```