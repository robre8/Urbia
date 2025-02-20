import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import menuIcon from "../../assets/menu.svg"
import { Switch } from "@/components/ui/switch"
import MyReports from "@/features/reports/MyReports"

function Menu() {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="fixed top-1">
          <img src={menuIcon} alt="menu hamburguesa" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
              <SheetTitle>
                <div className="text-[26px] p-4 font-[900]">
                URBIA
                </div>
              </SheetTitle>
            <hr className="w-full" />
            <SheetDescription>
              <section className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="seguridad" className="text-[16px] font-medium">Seguridad</label>
                  <Switch id="seguridad" />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="infraestructura" className="text-[16px] font-medium">Infraestructura</label>
                  <Switch id="infraestructura" />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="eventos-soc" className="text-[16px] font-medium">Eventos Sociales</label>
                  <Switch id="eventos-soc" />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="salud" className="text-[16px] font-medium">Salud</label>
                  <Switch id="salud" />
                </div>
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
  )
}

export default Menu