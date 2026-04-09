export type ProductsType = "TSHIRT" | "PULL";

export type Product = {
  name: string;
  quantity: number;
  type: ProductsType;
  price: number;
};

export type Discount = {
  type: string;
  value?: number; // Nouveauté : on rajoute une valeur en option pour stocker notre "10"
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

  // Méthode principale "execute" appelée par notre test pour lancer le calcul.
  // On ajoute le 2ème paramètre 'promotions' (avec un '?' pour qu'il soit optionnel et ne casse pas les Tests 1 et 2)
  execute(panier: Product[], promotions?: Discount[]): number {
    let prixTotal = 0;

    // On fait une boucle pour parcourir chaque produit du panier.
    for (const produit of panier) {
      // Pour calculer le total, on additionne ce qu'on a déjà (prixTotal)
      // avec le (prix du produit multiplié par sa quantité).
      prixTotal = prixTotal + (produit.price * produit.quantity);
    }

    // On délègue le calcul complexe des réductions à une méthode privée
    prixTotal = this.appliquerPromotions(prixTotal, promotions);

    // Le calcul est terminé. On appelle notre méthode pour envoyer la notification.
    this.notifier(prixTotal);

    // On renvoie le prix final pour que le test "expect(prixFinal).toBe(...)" puisse faire sa vérification.
    return prixTotal;
  }

  // --- Méthodes privées utiles --- //

  // Méthode privée pour gérer toutes les réductions
  private appliquerPromotions(prix: number, promotions?: Discount[]): number {
    // S'il n'y a pas de promotions, on renvoie simplement le prix de base
    if (!promotions) return prix;

    let nouveauPrix = prix;
    
    for (const promo of promotions) {
      if (promo.type === 'PERCENTAGE' && promo.value) {
        const montantAEnlever = (nouveauPrix * promo.value) / 100;
        nouveauPrix = nouveauPrix - montantAEnlever;
      }
    }
    return nouveauPrix;
  }

  // Méthode "privée"
  // Seulement la classe CalculatePriceUseCase peut l'utiliser
  private notifier(prix: number) {
    // Si on nous a bien passé un service de notification, alors on envoie le prix.
    if (this.notificationService) {
      this.notificationService.envoyer(prix);
    }
  }
}
