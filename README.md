# Arquitectura Blockchain empleando contenedores para su enseñanza.

Este proyecto está concebido por la iniciativa de dar a conocer y apoyar  el proceso de formación en tendencias tecnologicas como la industria 4.0 en éste caso referentes a Blockchain. Teniendo como bases, el aporte desde el ámbito educativo de un estudiante de Tecnología en Redes de computadores y seguridad informática de la Universidad Minuto de Dios, así como el docente encargado de dar guía y apoyar el proceso de construcción del mismo. (Para éste proyecto se tomó como referencia la fuente https://github.com/lhartikk/naivechain).

# Qué es Blockchain?

Blockchain o cadena de Bloques en español, es un protocolo conformado    por una serie de tecnologías basadas en P2P (Peer-to-peer),    criptografía de clave pública y time stamping (sellado de tiempo).    Blockchain funciona como una base de datos descentralizada en donde    la información está distribuida entre todos sus nodos. Estos nodos    conectados se encargan de validar y llevar a cabo operaciones de    transferencia de activos o bienes digitales.

En el momento que un nuevo nodo se una a la red, todas transacciones u operaciones ya registradas se descargan en él. La distribución de la información por la red se consigue mediante el uso de la tecnología P2P. El nombre de esta tecnología se refiere a la forma como se almacena la información. Blockchain crea distintos bloques y los une formando una cadena inmutable y creando una lógica de conexión que depende de la información contenida en los propios bloques, consiguiendo así un blindaje para el sistema evitando la modificación de estos, pues si se genera la más mínima afectación se rompe la seguridad y esto hace que pierda su conexión con los demás. Para validar y/o confirmar cada una de las transacciones se necesita un consenso de todos los nodos y con esto se elimina la centralización de las decisiones o la necesidad de tener un tercero certificador, dueño de las decisiones y el cual, genera un cobro de transacción.

Blockchain permite que todas las operaciones sean verificadas por cualquier nodo en la red, pues todas tienen uso de firmas con claves privadas de cada uno de los usuarios. Cuando se conoce la clave pública del usuario se puede determinar si el mensaje ha sido cifrado por su clave privada, pero la información no podrá ser modificada y firmada por otro al no tener su clave.

# Herramientas

Para el desarrollo de éste proyecto se ha tenido en cuenta la utilización de herramientas tecnológicas en dos vías:

La primera de estas es el ambiente de desarrollo de la app que garantizará la interacción de los usuarios con la misma y con la cual podrán llevarse a cabo escenarios de enseñanza y prácticas de entendimiento de la misma. **Ver Readme bc_app**. 

La segunda está enfocada en determinar la arquitectura del proyecto y con el cual podrá realizarse una distribución o replicación determinada por el tutor encargado de la misma. Se considera la elaboración como una guía facil en cuanto a su interpretación y y posible interacción de los usuarios quienes accedan a ella.  **Ver Readme develop**. 


## Estructura Blockchain Uniminuto

Esta estructura es de caracter educativa y se elaboró con medidas y configuraciones básicas, que podrán ser mejoradas y modificadas según se considere necesario para adicionar funcionalidades y vonvertirla en un ambiente más estable para su enseñanza y/o uso de la Unversidad Minuto de Dios.

Contiene las siguientes características:
 
- Se cuenta con una Interfaz HTTP para controlar los nodos.
- Se utilizan  Websockets para la comunicación entre los nodos (P2P).
- Los "Protocolos" para la comunicación P2P son simples.
- Los datos no se guardan en los nodos. Éstos son eliminados al reinicio de los mismos o al bajar las instancias.
- No se ejecutan pruebas de trabajo (PoW) o prueba de participación. Se pueden agregar bloques a la cadena sin competencia.

![](https://documents.app.lucidchart.com/documents/a6c09840-c139-463f-aac6-53d3c2346ab0/pages/fLIdogm_myHX?a=1972&x=86&y=1790&w=1168&h=646&store=1&accept=image%2F*&auth=LCA%2034f8729c4cc0838d14d0aea8b6b1eb4428af3cea-ts%3D1589770150)
## Funcionamiento

Para usar ésta herramienta se deben contar con conocimientos básicos de Git, Docker, Kubernetes pues son las plataformas con las que se interactuan para poner en funcionamiento la misma.

Se debe instalar en la máquina local docker y descargar la imagen desde `(https://hub.docker.com/repository/docker/jfaragon/blockchain-uniminutov1/general)` y se e iniciar los servicios y del repositorio `https://github.com/jfaragon100/blockchain-uniminuto`. Desde éste se realizará la iniciación y la persona designada 
    
-   **Licencia para el código de la herramienta:** Permisos que se otorgan a terceros para reutilizar la herramienta digital. Debe especificar el tipo de licencia y hacer referencia al archivo license.txt o licencia.txt con el contenido de la licencia. (Leer más sobre cómo licenciar [aquí](https://el-bid.github.io/guia-de-publicacion/documents/licenciamiento/))
    
-   **Licencia para la documentación de la herramienta:** Recomendamos el uso de las licencias creative commons para el licenciamiento de la documentación de las herramientas. La CC0-1.0, CC-BY-4.0 y CC-BY-SA-4.0 por ejemplo son licencias abiertas que se utilizan para material que no es de software, desde conjuntos de datos hasta videos. Tenga en cuenta que CC-BY-4.0 y CC-BY-SA-4.0 no deben usarse para el software.
    

Para herramientas desarrolladas por el BID por el momento recomendamos usar la Creative Commons IGO 3.0 Attribution-NonCommercial-NoDerivative (CC-IGO 3.0 BY-NC-ND).

## ¿A quién va dirigida la documentación?

La audiencia principal de la documentación son desarrolladores. No obstante, la sección de la guía de usuario va dirigida a los usuarios finales de la herramienta. Si esta sección es muy compleja, es una buena práctica dedicar un documento específico para esto. Aunque en el archivo Readme se debe especificar la existencia de esta documentación extra.



-   **Autores** Sección para dar créditos a los colaboradores de la herramienta.
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE0MjQzNjM1ODMsLTUzNTc4NjI0NSw1Mz
k0MTM3MzIsLTE3ODA1NDA0MDgsMTYyNTQxODg2NCwtMTk4NjQ2
MTI3MSwtMjgzMjQxNTk4LC0zMDgyMzg1NDYsLTY5MDA2NzgsLT
QxNzMyMTcwMywtMTcwMDE3NjUxNywxMDM1NTE1NjI2XX0=
-->