import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import MyReports from "@/features/reports/MyReports";

import menuIcon from "../../assets/menu.svg";
import SapoInfra from "../../assets/svgs/SapoInfra.svg";
import SapoPoli from "../../assets/svgs/SapoPoli.svg";
import SapoSalud from "../../assets/svgs/SapoSalud.svg";
import SapoSocial from "../../assets/svgs/SapoSocial.svg";

import MenuIcoInfra from "../../assets/svgs/MenuIcoInfra.svg";
import MenuIcoPoli from "../../assets/svgs/MenuIcoSeguri.svg";
import MenuIcoSalud from "../../assets/svgs/MenuIcoSalud.svg";
import MenuIcoSocial from "../../assets/svgs/MenuIcoSocial.svg";

// Definir categorías con sus respectivos íconos
const categories = [
  { id: "seguridad", label: "Seguridad", icon: SapoPoli, iconMenu: MenuIcoPoli },
  { id: "infraestructura", label: "Infraestructura", icon: SapoInfra, iconMenu: MenuIcoInfra },
  { id: "eventos-soc", label: "Eventos Sociales", icon: SapoSocial, iconMenu: MenuIcoSocial },
  { id: "salud", label: "Salud", icon: SapoSalud, iconMenu: MenuIcoSalud },
];

function Menu() {
  const [switchStates, setSwitchStates] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category.id]: true }), {})
  );

  const handleToggle = (id) => {
    setSwitchStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger className="fixed top-1">
          <img src={menuIcon} alt="menu hamburguesa" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <div className="text-[26px] p-4 font-[900]">URBIA</div>
            </SheetTitle>
            <hr className="w-full" />
            <SheetDescription>
              <section className="space-y-4 p-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={switchStates[category.id] ? category.iconMenu : category.icon}
                        alt={category.label}
                        className="w-8 h-8"
                      />
                      <label htmlFor={category.id} className="text-[16px] font-medium">
                        {category.label}
                      </label>
                    </div>
                    <Switch
                      id={category.id}
                      checked={switchStates[category.id]}
                      onCheckedChange={() => handleToggle(category.id)}
                    />
                  </div>
                ))}
              </section>
              <hr />
              <section>
                <MyReports />
              </section>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Menu;
