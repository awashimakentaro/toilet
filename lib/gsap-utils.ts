// GSAPのユーティリティ関数
import { gsap } from "gsap"

// テキストを左から右へスライドインさせる
export const slideInFromLeft = (element: string | Element | null, delay = 0, duration = 0.8) => {
  if (!element) return gsap.timeline() // 要素がない場合は空のタイムラインを返す

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
export const slideInFromRight = (element: string | Element | null, delay = 0, duration = 0.8) => {
  if (!element) return gsap.timeline() // 要素がない場合は空のタイムラインを返す

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
export const fadeInFromBottom = (element: string | Element | null, delay = 0, duration = 0.8) => {
  if (!element) return gsap.timeline() // 要素がない場合は空のタイムラインを返す

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
export const staggerElements = (
  elements: string | Element | NodeListOf<Element> | HTMLCollection | null,
  staggerTime = 0.1,
  delay = 0,
) => {
  // 要素がない場合や空の場合は早期リターン
  if (!elements) {
    console.warn("staggerElements: No elements provided")
    return gsap.timeline()
  }

  // HTMLElementの場合はchildrenを取得
  if (elements instanceof Element && elements.children) {
    elements = elements.children
  }

  // NodeListやHTMLCollectionの場合、長さをチェック
  if (
    (elements instanceof NodeList || elements instanceof HTMLCollection) &&
    typeof elements.length === "number" &&
    elements.length === 0
  ) {
    console.warn("staggerElements: Empty NodeList or HTMLCollection")
    return gsap.timeline()
  }

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
export const scaleIn = (element: string | Element | null, delay = 0, duration = 0.6) => {
  if (!element) {
    console.warn("scaleIn: No valid element found")
    return gsap.timeline() // 空のタイムラインを返す
  }

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
