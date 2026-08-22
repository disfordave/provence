# La langue française

> Mes notes de français, transformées petit à petit en site web.

C'est le site que je construis pendant que j'apprends le français.

Au lieu de prendre des notes classiques, j'essaie de réécrire ici ce que j'apprends avec mes propres mots. Quand un texte ou un tableau ne suffit pas à me faire comprendre quelque chose, j'essaie parfois d'en faire une petite représentation interactive.

Les cours sont écrits en MDX, donc ils restent proches de simples fichiers Markdown tout en pouvant contenir des composants React lorsque cela m'est utile.

**Site en ligne :** [francais.hsw.is](https://francais.hsw.is)  
**Lien court :** [fr.hsw.is](https://fr.hsw.is)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![Licence](https://img.shields.io/badge/Licence-AGPL--3.0--or--later-blue)
[![CI](https://github.com/disfordave/provence/actions/workflows/ci.yml/badge.svg)](https://github.com/disfordave/provence/actions/workflows/ci.yml)

---

## Sommaire

- [À propos](#à-propos)
  - [L'histoire du projet](#lhistoire-du-projet)
  - [Ma manière d'utiliser ce site](#ma-manière-dutiliser-ce-site)
- [Quelques choix techniques](#quelques-choix-techniques)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Écrire un cours](#écrire-un-cours)
- [Composants interactifs](#composants-interactifs)
- [Contribuer](#contribuer)
- [Conventions de code](#conventions-de-code)
- [Feuille de route](#feuille-de-route)
- [Licence](#licence)

---

## À propos

### L'histoire du projet

J'apprends le français, et j'ai commencé ce site lorsque je me suis rendu compte que reformuler ce que j'apprenais m'aidait davantage que de simplement prendre des notes.

C'est donc devenu mon propre cahier de français : des cours écrits en MDX, versionnés avec Git et publiés sur le Web. Je peux revenir sur une explication, ajouter une source ou la réécrire lorsque ma compréhension change.

Quand le texte ne suffit pas, j'essaie une autre forme. C'est par exemple pour cela que j'ai créé un composant interactif pour visualiser les relations entre certains temps.

Le principe est assez simple : si écrire m'aide, j'écris. Si un tableau m'aide, je fais un tableau. Si une interaction rend une notion plus claire, j'en fais un composant.

Le site avance au même rythme que mon apprentissage et n'a pas vraiment vocation à être "terminé".

### Ma manière d'utiliser ce site

J'essaie de garder quelques principes simples :

- **Écrire pour comprendre.** Si je ne peux pas reformuler clairement une notion, je ne la comprends probablement pas encore assez bien.
- **Écrire avec mes propres mots.** Je préfère reconstruire une explication plutôt que recopier celle d'un manuel.
- **Garder les sources.** Lorsque j'apprends quelque chose depuis un livre, un article, une vidéo ou un autre site, je veux pouvoir retrouver d'où cela vient.
- **Utiliser l'interactivité seulement lorsqu'elle aide.** Tout n'a pas besoin de devenir un composant React.
- **Garder les cours faciles à modifier.** Le contenu reste principalement du Markdown.
- **Pouvoir revenir sur ce que je pensais avoir compris.** Git rend assez naturel le fait de corriger et de faire évoluer mes notes.
- **Ne pas transformer mes notes en application de productivité.** Je n'ai pas besoin de points, de séries quotidiennes ou d'un compte utilisateur pour lire ce que j'ai écrit.

Le dépôt est public parce qu'il n'y a pas vraiment de raison de le garder privé. Si mes notes peuvent être utiles à quelqu'un d'autre, tant mieux. Et si quelqu'un trouve une erreur, sa correction peut aussi m'apprendre quelque chose.

---

## Quelques choix techniques

Le projet est volontairement assez simple.

Je préfère ajouter de la complexité lorsqu'un problème réel apparaît plutôt que de construire à l'avance une architecture dont mes notes n'ont pas encore besoin.

### MDX pour écrire normalement, React lorsque c'est utile

Chaque cours est un fichier `.mdx`.

La plupart du temps, j'écris donc simplement du Markdown :

```md
## Le passé composé

Le passé composé se forme généralement avec un auxiliaire...
```

Mais MDX me permet aussi d'importer un composant React directement dans le cours :

```mdx
import TensesSlider from "@/components/content/TensesSlider";

## Une représentation des temps

<TensesSlider />
```

Je peux ainsi garder le contenu lisible directement dans le dépôt sans construire un CMS, tout en ayant la possibilité de dépasser le format d'un document statique lorsque j'en ai besoin.

### Server Components par défaut

La majorité du site est constituée de texte.

Je garde donc les composants côté serveur par défaut et je n'ajoute `"use client"` que lorsqu'un composant a réellement besoin d'état, d'effets ou d'événements dans le navigateur.

Par exemple, un cours ou une liste de cours n'a pas besoin de devenir un Client Component simplement parce que le site utilise React.

À l'inverse, le curseur des temps et le menu mobile sont interactifs et vivent naturellement côté client.

### Les cours sont découverts depuis le contenu

Les cours vivent dans :

```text
src/content/
```

La liste des cours est construite à partir des fichiers présents dans ce dossier.

Je n'ai donc pas besoin de maintenir séparément un tableau contenant toutes les routes ou tous les cours.

Un fichier MDX contient également ses propres métadonnées :

```mdx
export const metadata = {
  title: "Les accords du participe passé",
  shortTitle: "Accords",
  description: "Quand et comment accorder le participe passé",
};
```

Le contenu d'un cours et les informations qui le décrivent restent ainsi au même endroit.

### Le sommaire vient de l'article réellement rendu

Je ne voulais pas maintenir manuellement une deuxième structure représentant les titres d'un cours.

`TableOfContents` lit donc les titres présents dans l'article rendu.

Comme ces titres n'existent que dans le DOM côté client, le composant traite l'article comme une source externe avec `useSyncExternalStore`. Un `MutationObserver` permet également au sommaire de suivre les changements du contenu rendu.

Les identifiants des titres sont générés avec `rehype-slug`, ce qui évite notamment les collisions lorsque plusieurs sections utilisent le même titre.

### Les composants interactifs restent des composants de contenu

Les composants pédagogiques vivent séparément dans :

```text
src/components/content/
```

L'objectif est qu'ils restent suffisamment autonomes pour pouvoir être utilisés depuis un cours sans transformer le contenu lui-même en application React complexe.

---

## Fonctionnalités

- **Cours en MDX** : chaque cours est un fichier lisible et versionné dans Git.
- **Composants React dans les cours** : une notion peut devenir interactive lorsqu'une représentation visuelle m'aide à la comprendre.
- **Sommaire automatique** : construit à partir des titres réellement rendus dans l'article.
- **Ancres de titres** : générées avec `rehype-slug`.
- **Liste des cours automatique** : les fichiers présents dans `src/content` sont découverts sans index manuel.
- **Navigation responsive** : panneaux latéraux sur grand écran et menu escamotable sur mobile.
- **Accessibilité** : éléments HTML natifs, navigation au clavier et attributs `aria` lorsque nécessaire.
- **Thème clair et sombre** : basé sur les préférences du système.
- **Métadonnées par cours** : titre et informations Open Graph générés pour les pages.
- **Manifeste d'application Web** : métadonnées utilisées par le navigateur pour l'intégration et l'installation du site.

---

## Stack technique

| Domaine   | Choix                                     | Pourquoi                                                                   |
| --------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| Framework | Next.js 16, App Router                    | Rendu serveur par défaut, routes dynamiques et métadonnées                 |
| UI        | React 19                                  | Server Components pour le contenu, Client Components pour les interactions |
| Langage   | TypeScript 5                              | Typage des composants et des métadonnées des articles                      |
| Contenu   | MDX, `@next/mdx`, `remark-gfm`            | Écrire principalement en Markdown tout en pouvant utiliser React           |
| Titres    | `rehype-slug`                             | Générer automatiquement les ancres des sections                            |
| Styles    | Tailwind CSS 4, `@tailwindcss/typography` | Mise en forme des articles et de l'interface                               |
| Icônes    | Heroicons                                 | Icônes simples pour l'interface                                            |
| Qualité   | ESLint 9, Prettier                        | Analyse et formatage du code                                               |

---

## Démarrage rapide

### Prérequis

- Node.js 20 ou plus récent
- npm

Le projet est actuellement développé avec Node.js 24.

### Installation

```bash
git clone https://github.com/disfordave/provence.git
cd provence
npm install
```

### Variables d'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

| Variable            | Rôle                                                               | Exemple                   |
| ------------------- | ------------------------------------------------------------------ | ------------------------- |
| `METADATA_BASE_URL` | URL de base utilisée pour les métadonnées et les images Open Graph | `https://francais.hsw.is` |

### Développement

```bash
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm run start
```

### Scripts disponibles

| Commande         | Rôle                               |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Lance le serveur de développement  |
| `npm run build`  | Compile le site pour la production |
| `npm run start`  | Lance la version de production     |
| `npm run lint`   | Exécute ESLint                     |
| `npm run format` | Formate le dépôt avec Prettier     |

---

## Structure du projet

```text
src/
├── app/
│   ├── cours/[slug]/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── manifest.json
│
├── components/
│   ├── CourseList.tsx
│   ├── TableOfContents.tsx
│   ├── InteractiveSidebarMenu.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx
│   └── content/
│       └── TensesSlider.tsx
│
├── content/
│   ├── bienvenue.mdx
│   └── temps.mdx
│
└── mdx-components.tsx
```

`src/content` contient les cours.

`src/components/content` contient les composants React destinés à être utilisés directement à l'intérieur de ces cours.

Le reste du projet s'occupe principalement de présenter ce contenu, de construire la navigation et de relier les fichiers MDX aux routes du site.

---

## Écrire un cours

Ajouter ou modifier un cours ne demande pas de connaître React.

### 1. Créer un fichier

Ajoutez un fichier dans `src/content` :

```text
src/content/accords.mdx
```

Le nom du fichier devient son slug :

```text
/cours/accords
```

### 2. Ajouter les métadonnées

```mdx
export const metadata = {
  title: "Les accords du participe passé",
  shortTitle: "Accords",
  description: "Quand et comment accorder le participe passé",
};

# Les accords du participe passé

Le participe passé employé avec **être** s'accorde avec le sujet.
```

| Champ         | Rôle                                   |
| ------------- | -------------------------------------- |
| `title`       | Titre complet du cours                 |
| `shortTitle`  | Titre court utilisé dans la navigation |
| `description` | Description courte du contenu          |

### 3. Écrire le cours

Les titres `##`, `###` et `####` alimentent automatiquement le sommaire.

Les tableaux GFM sont pris en charge, ce qui est pratique pour les conjugaisons et les comparaisons.

Les liens internes utilisent le routeur de Next.js. Les liens externes s'ouvrent dans un nouvel onglet.

Lorsque je ne suis pas certain d'une règle, j'essaie de conserver la source que j'ai utilisée pour l'apprendre ou la vérifier.

---

## Composants interactifs

Un cours peut utiliser un composant React directement :

```mdx
import TensesSlider from "@/components/content/TensesSlider";

## Les temps

<TensesSlider />
```

Les composants destinés au contenu sont placés dans :

```text
src/components/content/
```

J'essaie de leur appliquer quelques règles simples :

- Utiliser un élément HTML natif lorsqu'il existe.
- Garder l'accessibilité au clavier.
- Ajouter `"use client"` uniquement si nécessaire.
- Éviter de dépendre d'un cours précis lorsqu'un composant peut rester générique.
- Ne pas ajouter une interaction uniquement parce qu'elle est possible.
- Utiliser l'interactivité lorsque cela rend réellement une notion plus claire.

`TensesSlider`, par exemple, utilise de vrais `<input type="range">` plutôt qu'une imitation construite avec des `<div>`.

---

## Contribuer

Ce projet reste d'abord mon propre cahier de français, mais le dépôt est public volontairement.

Les corrections sont bienvenues, qu'elles concernent :

- une faute d'orthographe ;
- une règle grammaticale incorrecte ;
- une formulation peu naturelle ;
- une source plus précise ;
- un problème d'accessibilité ;
- un bug dans le site ;
- une amélioration d'un composant.

Pour une petite correction, une pull request directe suffit.

Pour une modification plus importante, une issue permet d'en discuter avant de commencer.

Avant d'ouvrir une pull request :

```bash
npm run format
npm run lint
npm run build
```

J'essaie également de garder les changements assez petits pour qu'une pull request corresponde à une idée principale.

Pour une modification de contenu, le raisonnement derrière l'explication est souvent aussi important que le changement lui-même.

---

## Conventions de code

Quelques conventions que j'essaie de suivre :

- TypeScript sans `any` lorsqu'un type raisonnable peut être décrit.
- Server Components par défaut.
- `"use client"` uniquement lorsqu'un composant en a réellement besoin.
- Tailwind CSS pour les styles de l'interface.
- Prettier comme référence pour le formatage.
- Peu de commentaires lorsque le code est évident.
- Des commentaires lorsque le pourquoi d'une décision ne l'est pas.
- Des éléments HTML natifs avant des composants interactifs personnalisés.

Le but n'est pas d'avoir beaucoup de règles. Je veux surtout pouvoir revenir dans le projet plusieurs mois plus tard et comprendre rapidement pourquoi quelque chose a été écrit de cette manière.

---

## Feuille de route

La feuille de route suit principalement ce dont j'ai besoin au fur et à mesure que j'apprends.

### Contenu

- [x] Premiers cours en MDX
- [x] Cours sur les temps
- [ ] Accords
- [ ] Pronoms
- [ ] Subjonctif
- [ ] Vocabulaire
- [ ] Organisation des sources et références
- [ ] Davantage d'exemples tirés de ce que je lis ou écoute

### Navigation

- [x] Liste automatique des cours
- [x] Sommaire automatique
- [ ] Catégories de contenu
- [ ] Relations entre les notions
- [ ] Recherche dans les cours
- [ ] Recherche dans le vocabulaire et les références

### Contenu interactif

- [x] Représentation interactive des temps
- [ ] D'autres visualisations lorsque j'en rencontre réellement le besoin
- [ ] Exercices auto-corrigés si cela devient utile dans ma façon d'apprendre

### Qualité

- [ ] Tests pour les fonctions et comportements importants
- [ ] Validation des métadonnées des cours
- [ ] Vérification automatique de `lint`, des tests et du build

Cette liste n'est pas un plan produit strict.

Elle changera probablement en même temps que ma façon d'apprendre le français.

---

## Licence

Ce projet est distribué sous licence **GNU AGPL-3.0-or-later**.

Voir [LICENSE](LICENSE).

Vous pouvez utiliser, modifier et redistribuer le projet dans les conditions prévues par cette licence.

---

## Crédits

Développé et maintenu par [Dave](https://github.com/disfordave).

- Site : [francais.hsw.is](https://francais.hsw.is)
- GitHub : [github.com/disfordave/provence](https://github.com/disfordave/provence)
- HSW.is : [hsw.is](https://hsw.is)
