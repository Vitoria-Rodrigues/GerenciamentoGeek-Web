export const cacheDOM = (seletores) => {
  const dom = {};
  for (const [chave, seletor] of Object.entries(seletores)) {
    dom[chave] = chave.startsWith("lista")
      ? document.querySelectorAll(seletor)
      : document.querySelector(seletor);
  }
  return dom;
};
