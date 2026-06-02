export interface PetOwner {
  id: string;
  ownerName: string;
  petName: string;
  petBreed?: string;
  petType: 'dog' | 'cat' | 'other';
  phone: string; // Formato: 5491133334444 (solo números, con código de país)
  message: string; // Mensaje por defecto para enviar por WhatsApp
  avatarUrl?: string; // URL opcional de la foto de la mascota o dueño
  status?: 'active' | 'lost' | 'found';
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
    ownerName: "Santi Insaurrualde",
    petName: "Beto",
    petBreed: "Salchicha",
    petType: "dog",
    phone: "+5493772583027",
    message: "¡Hola Santi! Encontré a tu perrito Beto. Por favor, comunícate conmigo para coordinar la entrega.",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "2",
    ownerName: "Santi Insaurrualde",
    petName: "Toto",
    petBreed: "Salchicha",
    petType: "cat",
    phone: "+5493772583027",
    message: "¡Hola Santi! Encontré a tu gatita Toto. Escríbeme cuando puedas para que coordinemos.",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "3",
    ownerName: "Santi Insaurrualde",
    petName: "Luna",
    petBreed: "Gato",
    petType: "dog",
    phone: "+5493772583027",
    message: "¡Hola Santi! Encontré a tu perrito Luna. Escríbeme para coordinar la devolución.",
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
