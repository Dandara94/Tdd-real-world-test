## Interview

### Setup

```bash

npm i
npm run dev
# ou
npm run test

cd frontend
npm i
npm run dev
```

### Objectif

On cherche à calculer le prix d'un panier lors d'une commande en ligne. La commande contient un panier avec des articles, et un ou plusieurs codes promo.  
**On veut donc créer la fonction permettant de déterminer le prix final du panier sur lequel est appliqué un ou plusieurs codes promo.**

Les codes promo peuvent être de plusieurs types :

- Une réduction en pourcentage (-10% sur la commande)
- Une réduction fixe (30€ d'offert) min 1€ la commande
- Un produit acheté, un produit offert (ex : un t-shirt acheté = un t-shirt offert).

- Black Friday

  - 50% sur tout le panier
  - Uniquement entre le vendredi 00h00 et le lundi 23h59 du week-end du Black Friday le 2025-28-11 au 2025-30-11.
  - Ne peut pas amener le total en dessous de 1 euro.
  - Cumulable avec d’autres promotions

Les réductions s’appliquent dans l’ordre défini par l’entreprise : d’abord les promos “produit”, ensuite les promos fixes/%, et enfin Black Friday.

Ils peuvent aussi avoir des conditions d'applications :

- Un code promo peut s’appliquer uniquement sur certains types de produits (exemple : uniquement sur les t-shirts)
- Réduction si la commande dépasse x€ (exemple : -10% dès 30 € d’achats)
- Un code promo ne doit jamais faire descendre le total sous 0.

**TLDR**:

- Calculer le montant final du panier après l'application des coupons dans le usecase `CalculatePriceUseCase`.
- Après le calcule du prix, on envoie un event à un service de notification pour informer le client du prix final de sa commande. (il faudra aussi le tester).

# test et notation

- Le but de cet exercice est de tester votre approche du TDD, pas de faire un code parfait. Nous allons donc évaluer votre code en fonction de votre approche du TDD.

- L'objectifs va etre de me rendre un projet avec les tests et l'implementation de votre usecase. Je vais regarder votre projet et je vais évaluer votre approche du TDD en fonction de la qualité de vos tests, de la qualité de votre code.



# Rappel sur le cycle du TDD

Je rappelle que le cycle du TDD est le suivant :
  - Écrire un test qui ne compile pas ou qui échoue pour les bonnes raisons.
  - Faire passer le test au vert en implémentant le code minimum nécessaire.
  - Refactoriser le code en conservant les tests au vert.



## Vous devrez indiquer en commentaire toutes les étapes d’avancement de votre use case, en respectant ce format : ##

// Test 1 : implémentation pour faire passer le test au vert
// Use case : CalculatePriceUseCase { ... }

// Test 1 : après refactorisation du code
// Use case : CalculatePriceUseCase { ... }

# Vous devrez procéder de cette manière pour chaque cas métier, les uns après les autres.

SI vous pouvez me le faire en commit c'est mieux of course 🙂

# Attentes complémentaires
Je souhaite également que vous utilisiez les bons termes en fonction des outils de test employés pour simuler votre environnement de production dans vos tests, par exemple :

mock
spy
stub (Oups -> StupReductionApiGateway)
fake 

Il est important d’utiliser le vocabulaire approprié selon le rôle réel de chaque doublure de test.


# Le travail devra être réalisé individuellement. Vous devrez me transmettre un lien vers votre repository GitHub contenant votre projet.Merci de m’envoyer ce lien en message privé sur Discord.


Et faites du mob programming pour réfléchir et travailler ensemble.
