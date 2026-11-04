/**
 * Библиотека тематических изображений. Каждое изображение — оригинальная
 * генерация под тему сайта, хранится в src/assets и описывается осмысленным alt.
 */
import heroHouse from "@/assets/hero-house.jpg";
import heroInterior from "@/assets/hero-interior.jpg";
import familyHouse from "@/assets/family-house.jpg";
import familyHouseHero from "@/assets/family-house-hero.jpg";
import familyHouseHeroMobile from "@/assets/family-house-hero-mobile-a.jpg";
import apartment from "@/assets/direction-apartment.jpg";
import house from "@/assets/direction-house.jpg";
import materials from "@/assets/materials.jpg";
import wallpaper from "@/assets/wallpaper-work.jpg";
import bathroom from "@/assets/topic-bathroom.jpg";
import floor from "@/assets/topic-floor.jpg";
import foundation from "@/assets/topic-foundation.jpg";
import roof from "@/assets/topic-roof.jpg";
import blocks from "@/assets/topic-walls-blocks.jpg";
import type { Image } from "./types";

export const IMAGES = {
  heroInterior: {
    src: heroInterior,
    alt: "Светлая гостиная загородного дома с панорамным окном, штукатуренными стенами и дубовым полом",
  },
  heroHouse: { src: heroHouse, alt: "Светлый частный дом с чистой архитектурой" },
  familyHouse: {
    src: familyHouse,
    alt: "Современный двухэтажный дом с деревянным фасадом и большими окнами, к которому по дорожке идёт семья: мама, папа, дочь и сын",
  },
  familyHouseHero: {
    src: familyHouseHero,
    alt: "Современный дом с деревянным и бетонным фасадом на закате; к террасе по дорожке идёт семья: мама, папа, дочь и сын",
  },
  familyHouseHeroMobile: {
    src: familyHouseHeroMobile,
    alt: "Современный дом с деревянным фасадом; к террасе по деревянному настилу идёт семья: мама, папа, дочь и сын",
  },
  apartment: {
    src: apartment,
    alt: "Отремонтированная квартира в старом доме: паркет ёлочкой, высокие окна, спокойные серые стены",
  },
  house: {
    src: house,
    alt: "Современный двухэтажный частный дом со светлым фасадом, деревянной облицовкой и фальцевой кровлей среди берёз",
  },
  materials: { src: materials, alt: "Образцы строительных и отделочных материалов на столе" },
  wallpaper: { src: wallpaper, alt: "Поклейка обоев: полотно прижимают к подготовленной стене" },
  bathroom: {
    src: bathroom,
    alt: "Ванная комната с крупноформатной плиткой под камень, душевой зоной без поддона и подвесной тумбой",
  },
  floor: {
    src: floor,
    alt: "Укладка ламината в пустой комнате: подложка, пачка ламелей и клинья для зазора у стены",
  },
  foundation: {
    src: foundation,
    alt: "Ленточный фундамент частного дома с обмазочной гидроизоляцией на щебёночной подготовке",
  },
  roof: { src: roof, alt: "Фальцевая кровля графитового цвета с водостоком и деревянным свесом" },
  blocks: {
    src: blocks,
    alt: "Стена из газобетонных блоков на тонкошовном клею с армированной перемычкой над окном",
  },
} satisfies Record<string, Image>;

export type ImageKey = keyof typeof IMAGES;
