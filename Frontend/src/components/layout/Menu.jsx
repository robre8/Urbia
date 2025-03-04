import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import MyReports from "@/features/reports/MyReports";
import { Menu as MenuIcon } from "lucide-react";
import FrogInfra from "../../assets/svgs/FrogInfra.svg";
import FrogPoli from "../../assets/svgs/FrogPoli.svg";
import FrogSalud from "../../assets/svgs/FrogSalud.svg";
import FrogSocial from "../../assets/svgs/FrogSocial.svg";
import useCategoryStore from "@/lib/store/useCategoryStore";
import { useUserAuth } from "@/lib/store/useUserAuth";
import UserMenu from "@/features/auth/MenuUser";
import UserLogin from "@/features/auth/UserLogin";

const categories = [
  { id: "infraestructura", label: "Infraestructura", icon: FrogInfra },
  { id: "seguridad", label: "Seguridad", icon: FrogPoli },
  { id: "salud", label: "Salud", icon: FrogSalud },
  { id: "eventosSociales", label: "Eventos Sociales", icon: FrogSocial },
];

function Menu() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toggles, toggleCategory } = useCategoryStore();
  const { user } = useUserAuth();

  return (
    <div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full border fixed top-5 left-5 border-gray-300 shadow-md bg-white hover:bg-gray-100 transition"
          >
            <MenuIcon size={22} />
          </button>
        </SheetTrigger>

        {/* 
          Forcing the menu content to fill available height (h-full) and
          using flex + flex-col allows us to place an element at the bottom.
        */}
        <SheetContent className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>
              <div className="text-[26px] p-4 font-[900]">URBIA</div>
            </SheetTitle>
            <hr className="w-full" />
            <SheetDescription>
              <section className="space-y-4 p-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={category.icon}
                        alt={category.label}
                        className="w-8 h-8"
                      />
                      <label
                        htmlFor={category.id}
                        className="text-[16px] font-medium"
                      >
                        {category.label}
                      </label>
                    </div>
                    <Switch
                      id={category.id}
                      checked={toggles[category.id]}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                  </div>
                ))}
              </section>
              <hr />
              <section>
                <MyReports closeDrawer={() => setIsSheetOpen(false)} />
              </section>
            </SheetDescription>
          </SheetHeader>

          {/* 
            Espacio flexible para que el contenido ocupe el espacio sobrante,
            de modo que este contenedor quede abajo.
          */}
          <div className="mt-auto p-4 md:hidden">
            {user ? <UserMenu /> : <UserLogin />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Menu;
