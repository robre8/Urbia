// Menu.jsx
import { useEffect, useState } from "react";
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
import useReportsStore from "@/lib/store/useReportsStore";
import { useUserAuth } from "@/lib/store/useUserAuth";
import FrogInfra from "../../assets/svgs/FrogInfra.svg";
import FrogPoli from "../../assets/svgs/FrogPoli.svg";
import FrogSalud from "../../assets/svgs/FrogSalud.svg";
import FrogSocial from "../../assets/svgs/FrogSocial.svg";
import useCategoryStore from "@/lib/store/useCategoryStore";
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
  const {
    fetchReportsByUserId,
    reportsByUserId,
    loading,
    error,
    deleteReport
  } = useReportsStore();

  const userId = user?.id || 1;

  useEffect(() => {
    if (isSheetOpen) {
      fetchReportsByUserId(userId);
    }
  }, [isSheetOpen, userId, fetchReportsByUserId]);

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
        <SheetContent className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>
              <div className="text-[26px] p-4 font-[900]">URBIA</div>
            </SheetTitle>
            <hr className="w-full" />
            <SheetDescription>
              Selecciona las categorías y revisa tus reportes
            </SheetDescription>
          </SheetHeader>

          <div className="p-4 space-y-4 overflow-y-auto">
            <section className="space-y-4">
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
              <MyReports
                closeDrawer={() => setIsSheetOpen(false)}
                reports={reportsByUserId}
                deleteReport={deleteReport}
                loading={loading}
                error={error}
              />
            </section>
          </div>

          <div className="mt-auto p-4 md:hidden">
            {user ? <UserMenu /> : <UserLogin />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Menu;
