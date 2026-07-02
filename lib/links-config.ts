export interface PetOwner {
  id: string;
  ownerName: string;
  petName: string;
  petBreed?: string;
  petType: "dog" | "cat" | "other";
  phone: string; // Formato: 5491133334444 (solo números, con código de país)
  message: string; // Mensaje por defecto para enviar por WhatsApp
  avatarUrl?: string; // URL opcional de la foto de la mascota o dueño
  status?: "active" | "lost" | "found";
}

/**
 * CONFIGURACIÓN DE DUEÑOS DE MASCOTAS
 * Puedes agregar, editar o quitar dueños de mascotas editando este arreglo.
 *
 * Importante para el campo 'phone':
 * - Debe contener únicamente números.
 * - Incluir código de país y código de área (ej: 54911... para Buenos Aires, Argentina).
 * - Sin símbolos "+" o "-" ni espacios.
 */
export const petOwners: PetOwner[] = [
  {
    id: "1",
    ownerName: "Camila Schiber",
    petName: "Beto",
    petBreed: "Salchicha",
    petType: "dog",
    phone: "5493772530875",
    message:
      "¡Hola Camila! Encontré a tu perrito Beto. Por favor, comunícate conmigo para coordinar la entrega.",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "2",
    ownerName: "Santi Insaurrualde",
    petName: "Toto",
    petBreed: "Salchicha",
    petType: "dog",
    phone: "5493772583027",
    message:
      "¡Hola Santi! Encontré a tu perrito Toto. Escríbeme cuando puedas para que coordinemos.",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "3",
    ownerName: "Agustina Insaurrualde",
    petName: "Luna",
    petBreed: "Gato",
    petType: "cat",
    phone: "5493772430927",
    message:
      "¡Hola Agustina! Encontré a tu gatita Luna. Escríbeme para coordinar la devolución.",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "4",
    ownerName: "Camila Altamirano",
    petName: "Kai",
    petBreed: "Perro",
    petType: "dog",
    phone: "3772534012",
    message:
      "¡Hola! Soy Kai 🐾 Si me encontraste, por favor contactá a mi familia: Camila Altamirano - 📞 3772 534012. Vivo en Rivadavia 855, Paso de los Libres. ¡Gracias por ayudarme a volver a casa!",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "5",
    ownerName: "Daiana Verón",
    petName: "Frida",
    petBreed: "Perro",
    petType: "dog",
    phone: "3756500334",
    message:
      "¡Hola! Soy Frida 🐾 🌼Si me encontraste, por favor contactá a mi familia. Vivo en Bartolomé Mitre 220, Paso de los Libres. ¡Gracias por ayudarme a volver a casa!",
    avatarUrl: "",
    status: "active",
  }
];

/**
 * Genera el enlace directo a WhatsApp para un dueño de mascota
 */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
