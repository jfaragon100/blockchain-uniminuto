# Arquitectura Blockchain empleando contenedores para su enseñanza.

Este proyecto está concebido por la iniciativa de dar a conocer y apoyar  el proceso de formación en tendencias tecnologicas como la industria 4.0 en éste caso referentes a Blockchain. Teniendo como bases, el aporte desde el ámbito educativo de un estudiante de Tecnología en Redes de computadores y seguridad informática de la Universidad Minuto de Dios, así como el docente encargado de dar guía y apoyar el proceso de construcción del mismo. (Para éste proyecto se tomó como referencia la fuente https://github.com/lhartikk/naivechain).

# Qué es Blockchain?
[From Wikipedia](https://en.wikipedia.org/wiki/Blockchain_(database)):

Blockchain o cadena de Bloques en español, es un protocolo conformado    por una serie de tecnologías basadas en P2P (Peer-to-peer),    criptografía de clave pública y time stamping (sellado de tiempo).    Blockchain funciona como una base de datos descentralizada en donde    la información está distribuida entre todos sus nodos. Estos nodos    conectados se encargan de validar y llevar a cabo operaciones de    transferencia de activos o bienes digitales.

En el momento que un nuevo nodo se una a la red, todas transacciones u operaciones ya registradas se descargan en él. La distribución de la información por la red se consigue mediante el uso de la tecnología P2P. El nombre de esta tecnología se refiere a la forma como se almacena la información. Blockchain crea distintos bloques y los une formando una cadena inmutable y creando una lógica de conexión que depende de la información contenida en los propios bloques, consiguiendo así un blindaje para el sistema evitando la modificación de estos, pues si se genera la más mínima afectación se rompe la seguridad y esto hace que pierda su conexión con los demás. Para validar y/o confirmar cada una de las transacciones se necesita un consenso de todos los nodos y con esto se elimina la centralización de las decisiones o la necesidad de tener un tercero certificador, dueño de las decisiones y el cual, genera un cobro de transacción.

Blockchain permite que todas las operaciones sean verificadas por cualquier nodo en la red, pues todas tienen uso de firmas con claves privadas de cada uno de los usuarios. Cuando se conoce la clave pública del usuario se puede determinar si el mensaje ha sido cifrado por su clave privada, pero la información no podrá ser modificada y firmada por otro al no tener su clave.

# Herramientas

Para el desarrollo de éste proyecto se ha tenido en cuenta la utilización de herramientas tecnológicas en dos vías:

La primera de estas es el ambiente de desarrollo de la app en la cual se utilizó lenguaje NodeJs el cual garantizará la interacción de los usuarios con la misma y con la cual podrán llevarse a cabo escenarios de enseñanza y prácticas de entendimiento de la misma. [**Ver Readme blockchain-um-app**](blockchain-um-app/README.md)

La segunda está enfocada en determinar la arquitectura del proyecto y con el cual podrá realizarse una distribución o replicación determinada por el tutor encargado de la misma. Se considera la elaboración como una guía facil en cuanto a su interpretación  y posible interacción de los usuarios quienes accedan a ella.  [**Ver Readme Scripts-kubernetes**](Scripts-kubernetes/README.md)


## Estructura Blockchain Uniminuto

Esta estructura es de caracter educativa y se elaboró con medidas y configuraciones básicas, que podrán ser mejoradas y modificadas según se considere necesario para adicionar funcionalidades y vonvertirla en un ambiente más estable para su enseñanza y/o uso de la Unversidad Minuto de Dios.

Contiene las siguientes características:
 
- Se cuenta con una Interfaz HTTP para controlar los nodos.
- Se utilizan  Websockets para la comunicación entre los nodos (P2P).
- Los "Protocolos" para la comunicación P2P son simples.
- Los datos no se guardan en los nodos. Éstos son eliminados al reinicio de los mismos o al bajar las instancias.
- No se ejecutan pruebas de trabajo (PoW) o prueba de participación. Se pueden agregar bloques a la cadena sin competencia.

![](https://documents.app.lucidchart.com/documents/a6c09840-c139-463f-aac6-53d3c2346ab0/pages/fLIdogm_myHX?a=1976&x=86&y=1790&w=1168&h=646&store=1&accept=image%2F*&auth=LCA%20fbcec49ed87d642dc61a6f3a1de5ac1b76a27110-ts%3D1589770150)
## Funcionamiento

Para usar ésta herramienta se deben contar con conocimientos básicos de Git, Docker y Kubernetes, pues son las plataformas con las que se interactuan para poner en funcionamiento la misma.

Se debe instalar en la máquina local docker y descargar la imagen desde [https://hub.docker.com/repository/docker/jfaragon/blockchain-uniminutov1/general](https://hub.docker.com/repository/docker/jfaragon/blockchain-uniminutov1/general). Para guiarse en el proceso se pueden soportar en el repositorio https://github.com/jfaragon100/blockchain-uniminuto. En éste se detalla la información del proyecto, con sus alcances y limitaciones, así como su funcionamiento, en cada uno de los recursos utilizados, desde el ambito de programación como de arquitectura.

Con la instalación y puesta en marcha de docker, se iniciará el servicio con un bloque en el cual se encontrarán datos iniciales, como lo son, su "Nombre", el Hash de su predecesor "0" (para el primer bloque), su "Timestamp", los datos dentro del bloque que en este caso son datos de ejemplo de un estudiante (Nombre, Carrera, Semestre), su Hash propio, el cual será construido con los parámetros que se muestran en la imagen de la estructura.
Con los comandos descritos en **Readme develop**, para el uso de docker, se puede ver el estatus de la blockchain, se pueden minar bloques con información personalizada dentro del mismo y se podrá observar como se cumplen los parámetros descritos en la estructura del mismo.

    
## ¿A quién va dirigida la herramienta y la documentación?

La audiencia principal de la herramienta y la documentación son profesores y estudiantes de carreras tecnológicas y de ingeniería de sistemas de la Universidad Minuto de Dios, quienes podrán hacer uso y modificación de la misma en aras de generar mejoras y ampliación del conocimiento para las nuevas generaciones de estudiantes que se integren y deseen crear nuevas herramientas con el uso de blockchain.
    
-   **Licencia para el código de la herramienta:** Ésta herramienta es de caracter educativo y su uso se establece exclusivamente para la Universidad Minuto de Dios, para ser usada como referente en la práctica de enseñanza en carreras tecnológicas y de ingeniería de Sistemas.

-   **Autores** 
- John Fredy Aragón C.
	Estudiante Tecnología en redes de computadores y seguridad Informática.
- Ing. Jaider Ospina Navas 
	Tutor y Líder de Semillero de Investigación "Blockchain".
- Ing. Yury Bohórquez M.
	Apoyo en código fuente NodeJs.
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTE1MzkxMzI5NCwtMTA0OTE2NDE2OCwxOD
QwMDY4NjQ2LDE4MzA4MTE0OSwtMTA5ODc1NzI5MiwtNDY3NjM2
NDIwLC01MzU3ODYyNDUsNTM5NDEzNzMyLC0xNzgwNTQwNDA4LD
E2MjU0MTg4NjQsLTE5ODY0NjEyNzEsLTI4MzI0MTU5OCwtMzA4
MjM4NTQ2LC02OTAwNjc4LC00MTczMjE3MDMsLTE3MDAxNzY1MT
csMTAzNTUxNTYyNl19
-->