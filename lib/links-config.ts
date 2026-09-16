export interface ContactPhone {
  phone: string; // Formato: 5491133334444 (solo números)
  name?: string; // Nombre o parentesco (ej: "Mamá", "Papá", "Lucas")
  label?: string; // Etiqueta opcional (ej: "Opción 1", "Contacto de emergencia")
  message?: string; // Mensaje personalizado opcional para este contacto
}

export interface ContactOption {
  phone: string;
  name: string;
  label?: string;
  message: string;
  whatsAppLink: string;
}

export interface PetOwner {
  id: string;
  ownerName: string;
  petName: string;
  petBreed?: string;
  petType: "dog" | "cat" | "other";
  phone: string; // Teléfono principal (ej: 5491133334444)
  phone2?: string; // Segundo teléfono opcional (ej: para segundo dueño o contacto de emergencia)
  phone2Name?: string; // Nombre para el segundo contacto (ej: "Lucas", "Mamá", etc.)
  phone2Message?: string; // Mensaje opcional específico para el segundo teléfono
  secondaryPhone?: string; // Alias de phone2
  secondaryOwnerName?: string; // Alias de phone2Name
  phones?: (string | ContactPhone)[]; // Opcional: lista de múltiples teléfonos
  contacts?: ContactPhone[]; // Opcional: lista detallada de contactos
  message: string; // Mensaje por defecto para enviar por WhatsApp
  avatarUrl?: string; // URL opcional de la foto de la mascota o dueño
  status?: "active" | "lost" | "found";
}

/**
 * CONFIGURACIÓN DE DUEÑOS DE MASCOTAS
 * Puedes agregar, editar o quitar dueños de mascotas editando este arreglo.
 *
 * Importante para los números de teléfono:
 * - Deben contener únicamente números.
 * - Incluir código de país y código de área (ej: 54911... para Buenos Aires, Argentina).
 * - Sin símbolos "+" o "-" ni espacios.
 *
 * ¿Cómo configurar dos (o más) números de WhatsApp?
 * Puedes usar cualquiera de estas opciones:
 *
 * OPCIÓN 1 (Recomendada y más fácil):
 *   phone: "5493772530875",
 *   phone2: "5493772111111", // Segundo número
 *   phone2Name: "Lucas (Hermano)", // Nombre que aparecerá en el segundo botón (opcional)
 *
 * OPCIÓN 2 (Usando una lista de teléfonos):
 *   phones: [
 *     { phone: "5493772530875", name: "Camila" },
 *     { phone: "5493772111111", name: "Lucas" }
 *   ],
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
  },
  {
    id: "6",
    ownerName: "Tania",
    petName: "Otto",
    petBreed: "Perro",
    petType: "dog",
    phone: "3772574109",
    message:
      "Hola Tania, encontré a Otto escribime y coordinamos para que lo busques",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "7",
    ownerName: "Tania",
    petName: "Cloy",
    petBreed: "Perro",
    petType: "dog",
    phone: "3772574109",
    message:
      "Hola Tania, encontré a Cloy escribime y coordinamos para que lo busques",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "8",
    ownerName: "Augusto",
    petName: "AKIA",
    petBreed: "Perro",
    petType: "dog",
    phone: "3772633650",
    message:
      "Hola Augusto, encontré a AKIA escribime y coordinamos para que lo busques",
    avatarUrl: "",
    status: "active",
  },
  {
    id: "9",
    ownerName: "Agustina Insaurrualde",
    petName: "Tino",
    petBreed: "Perro",
    petType: "dog",
    phone: "5493772430927",
    phone2: "5493772448967",
    phone2Name: "Joaquin",
    message:
      "¡Hola! Encontré a tu perrito Tino. Escríbeme para coordinar la devolución.",
    avatarUrl: "",
    status: "active",
  },
];

/**
 * Genera el enlace directo a WhatsApp para un dueño de mascota
 */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Obtiene todos los contactos de WhatsApp configurados para una mascota (1, 2 o más).
 * Normaliza automáticamente campos como 'phone', 'phone2', 'phones' o 'contacts'.
 */
export function getPetContacts(pet: PetOwner): ContactOption[] {
  const result: ContactOption[] = [];

  // Si tiene un array explícito de contacts detallados
  if (pet.contacts && pet.contacts.length > 0) {
    pet.contacts.forEach((c, idx) => {
      const msg = c.message || pet.message;
      const clean = c.phone.replace(/\D/g, "");
      result.push({
        phone: clean,
        name: c.name || (idx === 0 ? pet.ownerName : `Contacto ${idx + 1}`),
        label: c.label || (idx === 0 ? "Opción 1" : `Opción ${idx + 1}`),
        message: msg,
        whatsAppLink: getWhatsAppLink(clean, msg),
      });
    });
    return result;
  }

  // 1. Teléfono principal
  if (pet.phone) {
    const clean = pet.phone.replace(/\D/g, "");
    result.push({
      phone: clean,
      name: pet.ownerName,
      label: "Opción 1",
      message: pet.message,
      whatsAppLink: getWhatsAppLink(clean, pet.message),
    });
  }

  // 2. Segundo teléfono (phone2 o secondaryPhone)
  const secondPhone = pet.phone2 || pet.secondaryPhone;
  if (secondPhone) {
    const clean2 = secondPhone.replace(/\D/g, "");
    const name2 = pet.phone2Name || pet.secondaryOwnerName || "Segundo Contacto";
    const msg2 = pet.phone2Message || pet.message;
    result.push({
      phone: clean2,
      name: name2,
      label: "Opción 2",
      message: msg2,
      whatsAppLink: getWhatsAppLink(clean2, msg2),
    });
  }

  // 3. Array 'phones' si fue definido
  if (pet.phones && Array.isArray(pet.phones)) {
    pet.phones.forEach((item) => {
      const phoneNumber = typeof item === "string" ? item : item.phone;
      const clean = phoneNumber.replace(/\D/g, "");
      // Si ya está en la lista, no duplicar
      if (result.some((r) => r.phone === clean)) return;

      const contactName =
        typeof item === "string"
          ? `Contacto ${result.length + 1}`
          : item.name || `Contacto ${result.length + 1}`;
      const contactMsg =
        typeof item === "string" ? pet.message : item.message || pet.message;
      const contactLabel =
        typeof item !== "string" && item.label
          ? item.label
          : `Opción ${result.length + 1}`;

      result.push({
        phone: clean,
        name: contactName,
        label: contactLabel,
        message: contactMsg,
        whatsAppLink: getWhatsAppLink(clean, contactMsg),
      });
    });
  }

  return result;
}

