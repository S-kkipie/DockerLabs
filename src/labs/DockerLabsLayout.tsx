import { Link, Outlet, useLocation } from "react-router-dom";
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
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronDown, Slash } from "lucide-react";
import labs from "./labs";
function DockerLabsLayout() {
  const path = useLocation().pathname;
  console.log(path);
  return (
    <div className="my-8 mx-8 md:mx-16">
      {path === "/docker-labs" ? (
        <div>
          <Breadcrumb className="mb-5">
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
                          "/docker-labs/" +
                          lab.toLowerCase().split(" ").join("-")
                        }
                      >
                        <DropdownMenuItem key={lab}>{lab}</DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold mb-3">Docker Labs</h1>
          <hr className="border-primary  mb-8" />
          <div className="flex gap-6 mt-3">
            {labs.map((lab) => (
              <Link
                className="border rounded w-96 px-4 py-3 bg-card text-lg font-semibold"
                to={`/docker-labs/${lab.toLowerCase().replace(/\s/g, "-")}`}
                key={lab}
              >
                {lab}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default DockerLabsLayout;
