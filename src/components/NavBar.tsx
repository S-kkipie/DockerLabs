import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignJustify } from "lucide-react";
function NavBar() {
  return (
    <>
      <nav className="flex items-center justify-around py-8">
        <Link to="/">
          <h1 className="text-4xl font-bold">Skkippie</h1>
        </Link>
        <div className="hidden md:flex gap-8">
          <Button className="text-lg">Contact me</Button>
          <Link to="/docker-labs">
            <Button className="text-lg">Docker Labs</Button>
          </Link>
          <a href="https://github.com/S-kkipie">
            <Button className="text-lg">Github</Button>
          </a>
          <Button className="text-lg">LinkedIn</Button>
          <ModeToggle />
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AlignJustify />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to="/docker-labs">Docker Labs</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="https://github.com/S-kkipie">Github</a>
              </DropdownMenuItem>
              <DropdownMenuItem>LinkedIn</DropdownMenuItem>
              <DropdownMenuItem>
                {" "}
                Theme <span> </span>
                <ModeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <hr className="border-primary" />
    </>
  );
}

export default NavBar;
