---


---

<h1 id="scripts-kubernetes">Scripts-kubernetes</h1>
<p>En ésta sección encontramos cuatro recursos, los cuales son de una importancia relevante y con los cuales se genera el ambiente que nos permitirá trabajar desde kubernetes. En estos se encuentra toda la información necesaria para que desde un ambiente DevOps el sistema funcione con un despliegue ligero y efectivo.</p>
<h2 id="blockchain-1.yaml">blockchain-1.yaml</h2>
<p>Este Script determina el namespace de nuestro proyecto y al cual nos referiremos en todo momento desde Kubernetes.</p>
<ul>
<li>Definimos la Versión “V1”.</li>
<li>Definimos el tipo para que sea un “Namespace”.</li>
<li>En su metadata asignaremos el nombre “blockchain”.</li>
</ul>
<h2 id="blockchain-service-http.yaml">blockchain-service-http.yaml</h2>
<p>En este Script estamos habilitando el servicio de nuestro servidor HTTP al cual le haremos las peticiones y que se encargará de actualizar los cambios generados.</p>
<ul>
<li>Definimos la Versión “V1”.</li>
<li>Definimos el tipo para que sea un servicio “Service”.</li>
<li>En su metadata asignaremos el nombre “blockchain-service-http” y lo ubicaremos al namespace “blockchain”.</li>
<li>En sus especificaciones apuntaremos a la app “blockchain-uniminuto”.</li>
<li>Habilitando el protocolo TCP al puerto “8080”, quien direccionará al puerto del nodo “30001”.</li>
<li>Le daremos el nombre “svcserver”.</li>
<li>Lo definimos como un tipo “NodePort”.</li>
</ul>
<h2 id="blockchain-service-socket.yaml">blockchain-service-socket.yaml</h2>
<p>En este Script estamos construyendo el servicio de conexión por medio de sockets entre nuestros nodos.</p>
<ul>
<li>Definimos la Versión “v1”</li>
<li>Definimos el tipo para que sea un servicio “Service”</li>
<li>En la metadata asignaremos el nombre “blockchain-service-socket” y lo ubicaremos al namespace “blockchain”.</li>
<li>Es sus especificaciones apuntaremos a la app “blockchain-uniminuto”.</li>
<li>Habilitaremos el puerto TCP al puerto “6001”, el cual direccionará al puerto del nodo “31001”</li>
<li>Le daremos por nombre “listen-socket” pues desde éste se escucharan los nodos antecesores para la asignación del hash.</li>
<li>Lo definimos como un tipo “NodePort”.</li>
</ul>
<h2 id="deployment.yaml">deployment.yaml</h2>
<p>En este Script definiremos el ambiente de DevOps en el cual veremos la imagen de Docker y con la cual interactuaremos para descargar y utilizar en nuestras máquinas locales y/o virtualizadas.</p>
<ul>
<li>Definimos la Versión “apps/v1”</li>
<li>Definimos el tipo para que sea un Deployment “Deployment”</li>
<li>En la metadata asignaremos el nombre “deployment1” y lo ubicaremos al namespace “blockchain”.</li>
<li>Es sus especificaciones realizaremos dos réplicas, para que se generen dos nodos al iniciar el servicio y validemos la información contenida en docker y sus interacciones.</li>
<li>Apuntaremos a la app “blockchain-uniminuto”.</li>
<li>En las Especificaciones del container asignaremos el nombre “blockchian-uniminuto-containerv1”.</li>
<li>Damos la ruta para la descarga de nuestra imagen que tomamos de dockerhub “jfaragon/blockchain-uniminutov1:firsttry”</li>
<li>Ponemos que la política de llamado de imagenes sea siempre. (Esto permitirá que siempre estemos trabajando con la última versión de la imagen).</li>
<li>Asignamos para nuestro puerto del contenedor el “8080”.</li>
<li>Lo direccionaremos con el nombre svcserver escuchando el puerto del contenedor “6001”.</li>
<li>Lo nombraremos  “Listen Socket”.</li>
</ul>

