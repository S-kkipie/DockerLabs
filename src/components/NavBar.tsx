import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

function NavBar() {
  return (
    <>
      <nav className="flex items-center justify-around py-8">
        <Link to="/"><h1 className="text-4xl font-bold">Skkippie</h1></Link>
        <div className="flex gap-8">
          <Button className="text-lg">Contact me</Button>
          <Link to="/docker-labs"><Button className="text-lg">Docker Labs</Button></Link>
          <a href="https://github.com/S-kkipie"><Button className="text-lg">Github</Button></a>
          <Button className="text-lg">LinkedIn</Button>
          <ModeToggle/>
        </div>
      </nav>
      <hr className="border-primary"/>
    </>
  );
}

export default NavBar;
