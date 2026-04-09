export type ProductsType = "TSHIRT" | "PULL";

export type Product = {
  name: string;
  quantity: number;
  type: ProductsType;
  price: number;
};

export type Discount = {
  type: string;
  value?: number;
};

// UseCase CalculatePriceUseCase :
// 1. D'un moyen de calculer la somme de tous les produits.
// 2. D'un moyen de prévenir le client à la fin :système de notification.
export class CalculatePriceUseCase {

  // On déclare une variable pour garder "en mémoire" notre faux service de notification (notre Spy)
  notificationService: any;

  // On ajoute ce qu'on appelle un "Constructeur".
  // C'est la porte d'entrée de notre UseCase. Quand on fait "new CalculatePriceUseCase(...)", 
  // on peut faire passer notre faux service par cette porte. 
  constructor(notificationService?: any) {
    this.notificationService = notificationService;
  }

  // Ajout du paramètre dateActuelle (par défaut à "maintenant")
  execute(panier: Product[], promotions?: Discount[], dateActuelle: Date = new Date()): number {
    let prixTotal = 0;

    // On fait une boucle pour parcourir chaque produit du panier.
    for (const produit of panier) {
      // Pour calculer le total, on additionne ce qu'on a déjà (prixTotal)
      // avec le (prix du produit multiplié par sa quantité).
      prixTotal = prixTotal + (produit.price * produit.quantity);
    }

    // On passe la date à la méthode de calcul des promotions
    prixTotal = this.appliquerPromotions(prixTotal, panier, promotions, dateActuelle);

    // Le calcul est terminé. On appelle notre méthode pour envoyer la notification.
    this.notifier(prixTotal);

    // On renvoie le prix final pour que le test "expect(prixFinal).toBe(...)" puisse faire sa vérification.
    return prixTotal;
  }

  private appliquerPromotions(prix: number, panier: Product[], promotions?: Discount[], dateActuelle: Date = new Date()): number {
    if (!promotions) return prix;

    let nouveauPrix = prix;
    let estBlackFridayActif = false;

    for (const promo of promotions) {
      switch (promo.type) {
        case 'PERCENTAGE':
          if (promo.value) nouveauPrix -= (nouveauPrix * promo.value) / 100;
          break;

        case 'FIXED':
          if (promo.value) nouveauPrix -= promo.value;
          break;

        case 'UN_ACHETE_UN_OFFERT':
          for (const produit of panier) {
            nouveauPrix -= Math.floor(produit.quantity / 2) * produit.price;
          }
          break;

        case 'BLACK_FRIDAY':
          // Définition de la période : du vendredi 28/11/2025 au lundi 01/12/2025
          const dateDebut = new Date('2025-11-28T00:00:00');
          const dateFin = new Date('2025-12-01T23:59:59');

          if (dateActuelle >= dateDebut && dateActuelle <= dateFin) {
            nouveauPrix = nouveauPrix * 0.5; // -50%
            estBlackFridayActif = true;
          }
          break;
      }
    }

    // Si le Black Friday a été appliqué, le minimum est de 1€
    if (estBlackFridayActif) {
      return Math.max(1, nouveauPrix);
    }

    // Sinon le minimum classique est de 0€
    return Math.max(0, nouveauPrix);
  }

  // Méthode "privée"
  // Seulement la classe CalculatePriceUseCase can l'utiliser
  private notifier(prix: number) {
    if (this.notificationService) {
      this.notificationService.envoyer(prix);
    }
  }
}
