# ДомКлючПро

Независимый справочный портал о квартирах и частных домах: категории по двум направлениям, статьи, инструкции, материалы, справочник терминов и строительные калькуляторы.

Стек: TanStack Start v1 (React 19, Vite 7, SSR), Tailwind CSS v4, сборка через Nitro под Cloudflare Workers.

## Запуск

```sh
bun install   # или npm i
bun run dev   # http://localhost:8080
bun run test  # vitest: модель контента, маршруты, формулы, sitemap, монетизация
bun run build
```

## Структура

| Путь | Что внутри |
| --- | --- |
| `src/content/` | Единая модель контента: типы, категории (`taxonomy.ts`), статьи (`articles.ts`), материалы (`materials.ts`), изображения (`images.ts`), URL (`urls.ts`), валидатор (`validate.ts`) |
| `src/data/` | Исходные тексты разделов, инструкций, справочника и настройки сайта (`site.ts`) |
| `src/features/wallpaper-calculator/` | Калькулятор обоев (формулы покрыты тестами) |
| `src/features/calculators/` | Формулы и конфигурации калькуляторов краски, плитки, ламината, блоков, бетона, утеплителя |
| `src/monetization/` | Типы и выключенные по умолчанию партнёрские блоки, рекламные слоты, заявки |
| `src/lib/seo.ts` | Единый `pageHead()`: title, description, Open Graph, canonical, Schema.org |
| `src/lib/sitemap.ts` | Список URL для `/sitemap.xml` из модели контента |
| `src/routes/` | Маршруты (файловая маршрутизация TanStack Router) |

## Как добавить статью

1. Добавьте запись в `src/content/articles.ts` через `make({...})`: slug, заголовок, описание, категории, подкатегории, теги, связи, `updatedAt` (дата реального изменения).
2. Запустите `bun run test` — валидатор проверит уникальность URL и SEO-заголовков, существование категорий и связей.
3. Статья автоматически появится в категориях, поиске, sitemap и на странице «Статьи».

## SEO и вебмастера

- Каждая страница задаёт title, description, Open Graph, Twitter, canonical (относительный, пока нет домена) и JSON-LD (WebSite, BreadcrumbList, Article, HowTo, WebApplication).
- `/sitemap.xml` строится из модели: только опубликованные страницы, `lastmod` — только из `updatedAt`.
- **Яндекс Вебмастер / Google Search Console**: впишите код из мета-тега подтверждения в `SITE.verification` (`src/data/site.ts`), опубликуйте сайт, подтвердите права и добавьте `https://<домен>/sitemap.xml`.
- `robots.txt` и `sitemap.xml` генерируются автоматически (`src/routes/robots[.]txt.tsx`, `src/routes/sitemap[.]xml.tsx`). Строка `Sitemap:` подставляется сама.

## Монетизация

Всё выключено, пока нет реальных договоров. Вымышленные магазины, цены и ссылки не добавляются.

- Партнёрские предложения — `PARTNER_OFFERS` в `src/monetization/config.ts`. Предложение без токена `erid` не показывается; блок помечается «Реклама» и названием рекламодателя, ссылки получают `rel="sponsored nofollow"`.
- Рекламные слоты (`AdSlot`) — включаются флагами `ADS`.
- Заявки исполнителям — тип `LeadRequest` и флаг `LEADS_ENABLED`; форму стоит включать вместе с политикой обработки персональных данных.

## Статическая сборка и GitHub Pages

Проверено 3 ноября 2026 г. в отдельной копии проекта с включённым `prerender` TanStack Start: из 14 обнаруженных страниц статически отрендерилась только главная, остальные завершились циклом перенаправлений и остались на SSR. **Сейчас проект не совместим с GitHub Pages.** Публикация работает через Lovable (Cloudflare Workers). Для GitHub Pages потребуется отдельная доработка: разобраться с перенаправлениями пререндера (слэш в конце адреса), отрендерить sitemap статически и настроить базовый путь.

## Экспорт

Исходный код синхронизируется с GitHub через Lovable. В архив не входят `node_modules`, `.output`, `dist`.

## Настройки запуска (v6.0)

Все значения задаются переменными окружения при сборке (файл `.env` локально или настройки хостинга). Пустое значение — функция просто выключена, сайт работает без ошибок.

| Переменная | Назначение |
|---|---|
| `VITE_SITE_URL` | Постоянный адрес, напр. `https://domkluchpro.ru`. Делает canonical, og:url, хлебные крошки и sitemap абсолютными, включает og:image (`public/og-image.jpg`). |
| `VITE_YANDEX_METRIKA_ID` | Номер счётчика Яндекс Метрики. |
| `VITE_GA4_ID` | Measurement ID Google Analytics 4 (`G-XXXXXXX`). |
| `VITE_YANDEX_VERIFICATION` | Значение `content` мета-тега подтверждения Яндекс Вебмастера. |
| `VITE_GOOGLE_VERIFICATION` | Значение `content` мета-тега Google Search Console. |

Файлы подтверждения (`yandex_xxx.html`, `googlexxx.html`) кладите в `public/` — они отдаются по корню сайта.

### Cookies и аналитика
- Согласие: `src/lib/consent.ts` (ключ `dk-consent`, хранит выбор и дату). Баннер и окно настроек: `src/components/site/CookieConsent.tsx`. Ссылка «Настройки cookies» — в подвале.
- Аналитика: `src/lib/analytics.ts`. Скрипты Метрики и GA4 загружаются только после согласия на аналитические cookies, один раз. Функция `track()` вырезает имена, телефоны, e-mail, адреса, города и тексты.
- События: `calculator_used`, `calculation_completed`, `configurator_used`, `configuration_saved`, `estimate_viewed`, `result_printed`, `material_viewed`, `store_clicked`, `house_project_viewed`, `partner_clicked`, `lead_submitted`. В Метрике это цели (`reachGoal`) — создайте одноимённые цели типа «JavaScript-событие».

### География
- Данные: `src/data/regions.ts` — 18 субъектов ЦФО, схема `/region`, страницы `/region/<slug>`.
- Регион со `status: "planned"` открывается, но имеет `noindex` и не попадает в sitemap. Чтобы опубликовать регион, заполните `content` (климат — только с `sources`) и поставьте `status: "published"`.

### Документы
`src/data/legal.ts` → `/dokumenty/...`: политика конфиденциальности, cookies, согласие на обработку ПДн, правила, раскрытие партнёрства. Это шаблоны: заполните поля в квадратных скобках и согласуйте с юристом.

## Подключение к поисковым системам

1. Опубликуйте сайт на постоянном домене и задайте `VITE_SITE_URL`.
2. **Яндекс Вебмастер** (webmaster.yandex.ru): «Добавить сайт» → введите адрес → выберите «Мета-тег», скопируйте значение `content` в `VITE_YANDEX_VERIFICATION`, пересоберите сайт, нажмите «Проверить». Альтернатива — HTML-файл в `public/` или DNS-запись.
3. **Google Search Console** (search.google.com/search-console): ресурс «Домен» (подтверждение DNS TXT у регистратора) или «Префикс URL» (мета-тег → `VITE_GOOGLE_VERIFICATION`).
4. **Sitemap**: Вебмастер → «Индексирование → Файлы Sitemap»; Search Console → «Файлы Sitemap». Адрес: `https://<домен>/sitemap.xml`.
5. **Проверка индексации**: Вебмастер → «Страницы в поиске» и «Проверка статуса URL»; Search Console → «Проверка URL» и отчёт «Страницы».
6. **Ошибки сканирования**: Вебмастер → «Диагностика»; Search Console → «Индексирование → Страницы» (причины исключения).
7. **canonical и robots**: откройте `https://<домен>/robots.txt`; в «Проверке URL» Google показывает выбранный canonical; в Вебмастере — «Анализ robots.txt».
8. **Переобход новых страниц**: Вебмастер → «Индексирование → Переобход страниц»; Search Console → «Проверка URL» → «Запросить индексирование».

Показатели Core Web Vitals (LCP, INP, CLS) в рамках v6.0 не измерялись — проверьте их после публикации в PageSpeed Insights и отчёте «Основные интернет-показатели».
