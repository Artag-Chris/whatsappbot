import { keywords } from "../config/keywords/keywords";


export const findMenu = (message: string) => {
  const lowerCaseMessage = message.toLowerCase();
  let respuestaAutomaticaEnviada = false;
  for (const [menu, words] of Object.entries(keywords)) {
    if (words.some((keyword) => new RegExp(keyword, 'i').test(lowerCaseMessage))) {
      // Si se ha encontrado una coincidencia, envía la respuesta automática
      const respuestaAutomatica = `¡Gracias por tu paciencia! 😊
*Tu mensaje está en línea y pronto uno de nuestros agentes estará encantado de ayudarte*. 🙌
*Por favor, espera un momento* y estaremos contigo en breve. ⏳`;
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