// GSAPのユーティリティ関数
import { gsap } from "gsap"

// テキストを左から右へスライドインさせる
export const slideInFromLeft = (element: string | Element, delay = 0, duration = 0.8) => {
  return gsap.fromTo(
    element,
    {
      x: -100,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power3.out",
    },
  )
}

// テキストを右から左へスライドインさせる
export const slideInFromRight = (element: string | Element, delay = 0, duration = 0.8) => {
  return gsap.fromTo(
    element,
    {
      x: 100,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power3.out",
    },
  )
}

// 下から上へフェードインさせる
export const fadeInFromBottom = (element: string | Element, delay = 0, duration = 0.8) => {
  return gsap.fromTo(
    element,
    {
      y: 50,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power3.out",
    },
  )
}

// 要素を順番にアニメーションさせる
export const staggerElements = (elements: string | Element, staggerTime = 0.1, delay = 0) => {
  return gsap.fromTo(
    elements,
    {
      y: 20,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: staggerTime,
      delay,
      ease: "power2.out",
    },
  )
}

// スケールアップしながらフェードイン
export const scaleIn = (element: string | Element, delay = 0, duration = 0.6) => {
  return gsap.fromTo(
    element,
    {
      scale: 0.8,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease: "back.out(1.7)",
    },
  )
}
