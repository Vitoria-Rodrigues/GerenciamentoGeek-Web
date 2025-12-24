import { gsap } from "gsap";

export const animarEntradaTela = (elemento) => {
  gsap.fromTo(
    elemento,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: "power2.out" }
  );
};

export const animarSaidaLogin = (elemento, callback) => {
  gsap.to(elemento, {
    opacity: 0,
    duration: 0.3,
    onComplete: callback,
  });
};
