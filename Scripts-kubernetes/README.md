# Scripts-kubernetes

En ésta sección encontramos cuatro recursos, los cuales son de una importancia relevante y con los cuales se genera el ambiente que nos permitirá trabajar desde kubernetes. En estos se encuentra toda la información necesaria para que desde un ambiente DevOps el sistema funcione con un despliegue ligero y efectivo.

## blockchain-1.yaml

Este Script determina el namespace de nuestro proyecto y al cual nos referiremos en todo momento desde Kubernetes.

- Definimos la Versión "V1".
- Definimos el tipo para que sea un "Namespace".
- En su metadata asignaremos el nombre "blockchain".
	
## blockchain-service-http.yaml
En este Script estamos habilitando el servicio de nuestro servidor HTTP al cual le haremos las peticiones y que se encargará de actualizar los cambios generados.

- Definimos la Versión "V1".
- Definimos el tipo para que sea un servicio "Service".
- En su metadata asignaremos el nombre "blockchain-service-http" y lo ubicaremos al namespace "blockchain".
- En sus especificaciones apuntaremos a la app "blockchain-uniminuto".
- Habilitando el protocolo TCP al puerto "8080", quien direccionará al puerto del nodo "30001".
- Le daremos el nombre "svcserver".
- Lo definimos como un tipo "NodePort". 

## blockchain-service-socket.yaml
En este Script estamos construyendo el servicio de conexión por medio de sockets entre nuestros nodos.

- Definimos la Versión "v1"
- Definimos el tipo para que sea un servicio "Service"
- En la metadata asignaremos el nombre "blockchain-service-socket" y lo ubicaremos al namespace "blockchain".
- Es sus especificaciones apuntaremos a la app "blockchain-uniminuto".
- Habilitaremos el puerto TCP al puerto "6001", el cual direccionará al puerto del nodo "31001"
- Le daremos por nombre "listen-socket" pues desde éste se escucharan los nodos antecesores para la asignación del hash.
- Lo definimos como un tipo "NodePort". 

## deployment.yaml
En este Script definiremos el ambiente de DevOps en el cual veremos la imagen de Docker y con la cual interactuaremos para descargar y utilizar en nuestras máquinas locales y/o virtualizadas.

- Definimos la Versión "apps/v1"
- Definimos el tipo para que sea un Deployment "Deployment"
- En la metadata asignaremos el nombre "deployment1" y lo ubicaremos al namespace "blockchain".
- Es sus especificaciones realizaremos dos réplicas, para que se generen dos nodos al iniciar el servicio y validemos la información contenida en docker y sus interacciones.
- Apuntaremos a la app "blockchain-uniminuto".
- En las Especificaciones del container asignaremos el nombre "blockchian-uniminuto-containerv1".
- Damos la ruta para la descarga de nuestra imagen que tomamos de dockerhub "jfaragon/blockchain-uniminutov1:firsttry"
- Ponemos que la política de llamado de imagenes sea siempre. (Esto permitirá que siempre estemos trabajando con la última versión de la imagen).
- Asignamos para nuestro puerto del contenedor el "8080".
- Lo direccionaremos con el nombre svcserver escuchando el puerto del contenedor "6001".
- Lo nombraremos  "Listen Socket". 

### La arquitectura resultante se muestra en la siguiente figura

![](https://app.lucidchart.com/documents/edit/ef7c2906-d840-40ea-acf3-4f265b397c47/0_0?beaconFlowId=5ABAFB9FA7B98E3B)







