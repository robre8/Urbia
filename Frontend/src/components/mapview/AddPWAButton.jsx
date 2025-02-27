import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, QrCode, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QRCodeCanvas } from "qrcode.react";
import logo from "/frogIco.png";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showIosInfo, setShowIosInfo] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const checkIfPWAIsInstalled = () => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    setIsPWAInstalled(isStandalone);
  };

  useEffect(() => {
    checkIfPWAIsInstalled();

    if (!isIOS) {
      const handler = (event) => {
        event.preventDefault();
        setDeferredPrompt(event);
      };

      window.addEventListener("beforeinstallprompt", handler);
      document.addEventListener("visibilitychange", checkIfPWAIsInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
        document.removeEventListener("visibilitychange", checkIfPWAIsInstalled);
      };
    }
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
    });
  };

  return (
    <TooltipProvider>
      <div className="relative flex items-center gap-2 z-[9999]">
        {!isIOS && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className={`flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 shadow-md transition ${
                  isPWAInstalled
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-gray-800"
                } z-[9999]`}
                onClick={handleInstallClick}
                disabled={isPWAInstalled}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={!isPWAInstalled ? { scale: 1.1 } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Download size={22} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="z-[9999]">
              {isPWAInstalled ? "App ya instalada" : "Descargar App"}
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 shadow-md bg-white hover:bg-gray-100 text-gray-800 transition z-[9999]"
              onClick={() => setShowQR(!showQR)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <QrCode size={22} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent className="z-[9999]">Escanear QR</TooltipContent>
        </Tooltip>

        {isIOS && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 shadow-md bg-white hover:bg-gray-100 text-gray-800 transition z-[9999]"
                onClick={() => setShowIosInfo(!showIosInfo)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Info size={22} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="z-[9999]">Cómo instalar en iPhone</TooltipContent>
          </Tooltip>
        )}

        {showQR && (
          <motion.div
            className="absolute top-full right-0 mt-2 p-4 w-64 bg-white border border-gray-300 shadow-lg rounded-lg flex items-center gap-4 z-[9999]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-700 text-center mb-2">Escanea para instalar</p>
              <QRCodeCanvas value={window.location.origin} size={128} bgColor="transparent" fgColor="#000000" level="H" />
            </div>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  );
}
