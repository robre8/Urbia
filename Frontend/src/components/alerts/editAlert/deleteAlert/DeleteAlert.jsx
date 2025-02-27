import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
//import "../../../components/alerts/styles/sweetAlertStyles.css"
import warning from "@/assets/Warning.svg"

const deleteAlert = (id, onDelete) => {
  Swal.fire({
    title: "Eliminar reporte",
    text: "Estás a punto de eliminar este reporte. Una vez eliminado, no podrás recuperarlo.",
    imageUrl: warning,
    showCancelButton: true,
    cancelButtonColor: "#222222",
    confirmButtonColor: "#F53434",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Eliminar",
    reverseButtons: true,
    customClass: {
      popup: "w-[590px] h-[320px] shadow-xl rounded-[16px] no-scroll-swal",
      title: "text-[24px] text-center text-black font-semibold",
      cancelButton: "w-[267px] bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-[16px]",
      confirmButton: "w-[267px] bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-[16px]",
    },
    didOpen: () => {
      document.querySelector(".swal2-image").style.cssText = `
      margin-top: 30px; 
      width: 64px; 
      height: 64px;
    `;

      document.querySelector(".swal2-title").style.cssText = `
      padding-bottom: 10px;
    `;
    
      document.querySelector(".swal2-html-container").style.cssText = `
        font-size: 16px;
        padding: 10px;
        max-width: 500px;
        text-align: center;
        margin: 0 auto;
        color: black;
        overflow: hidden; /* Oculta el scroll */
        max-height: none;
      `;
    },
  }).then((result) => {
    if(result.isConfirmed) {
      onDelete(id);

    Swal.fire({
      title: "Eliminado",
      text: "El reporte ha sido eliminado correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
      customClass: {
        popup: "w-[590px] h-[320px] shadow-xl rounded-[16px] no-scroll-swal",
        title: "text-[24px] text-center text-black font-semibold",
        htmlContainer: "text-[18px] text-gray-700 px-6 py-3", 
        confirmButton: "bg-[#9BEE5E] text-black px-6 py-2 rounded-lg hover:bg-[#9BEE5E]-700 transition",
      },
    });
    }
  })
}

export default deleteAlert;
