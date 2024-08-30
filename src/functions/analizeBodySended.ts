import { keywords } from "../config/keywords/keywords";


export const findMenu = (message: string) => {
    for (const [menu, words] of Object.entries(keywords)) {
      if (words.some((keyword) => new RegExp(keyword, 'i').test(message))) {
        return menu;
      }
    }
    //si no se encuentra la palabra en el menu debera hacer otra cosa
    return null;
  };


  