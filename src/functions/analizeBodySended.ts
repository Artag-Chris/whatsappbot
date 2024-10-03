import { keywords } from "../config/keywords/keywords";


export const findMenu = (message: string) => {
  const lowerCaseMessage = message.toLowerCase();
  let respuestaAutomaticaEnviada = false;
  for (const [menu, words] of Object.entries(keywords)) {
    if (words.some((keyword) => new RegExp(keyword, 'i').test(lowerCaseMessage))) {
      // Si se ha encontrado una coincidencia, envía la respuesta automática
      const respuestaAutomatica = 'Será atendido en breve. Por favor, espere un momento.';
      // Envía la respuesta automática
      // ...
      respuestaAutomaticaEnviada = true;
      return respuestaAutomatica;
    }
  }
  // Si no se ha enviado una respuesta automática, envía el menú
  if (!respuestaAutomaticaEnviada) {
    return null;
  }
};