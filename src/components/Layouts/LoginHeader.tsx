import React from "react";
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem, Link } from "@nextui-org/react";

export default function App() {
  const menuItems = [
    "Universities",
    "Courses",
    "Our Reach",
    "Be our Ambassador",
    "Partner with Us",
    "Login",
  ];

  return (
    <Navbar isBordered className="py-6">
      <div className="container">
        <div className="row">
          <NavbarContent className="sm:hidden pr-3" justify="start">
            <NavbarBrand>
              <img className="h-12 flex" src="https://skylineimmigration.com/wp-content/uploads/2024/01/skyline-immigration-logo.png" alt="skyLine" />
            </NavbarBrand>
            <NavbarContent className="sm:hidden justify-center" justify="end">
            <NavbarMenuToggle />
          </NavbarContent>
          </NavbarContent>
          

          <NavbarContent className="hidden sm:flex gap-4" justify="start">
            <NavbarBrand>
              <img className="h-12 flex hidden lg:flex" src="https://skylineimmigration.com/wp-content/uploads/2024/01/skyline-immigration-logo.png" alt="skyLine" />
            </NavbarBrand>
            <NavbarItem>
              <Link  href="https://skylineimmigration.com/" className="font-[700]">
              Home
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="https://skylineimmigration.com/contact-us/" className="font-[700]">
              Contact Us
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#!" className="anim-btn">Login</Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarMenu>
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full"
                  color={index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"}
                  href="#!"
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </div>
      </div>
    </Navbar>
  );
}
