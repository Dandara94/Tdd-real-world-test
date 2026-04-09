export type ProductsType = "TSHIRT" | "PULL";

export type Product = {
  name: string;
  quantity: number;
  type: ProductsType;
  price: number;
};

export type Discount = {
  type: string;
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
  execute(panier: Product[]): number {
    let prixTotal = 0;

    // On fait une boucle pour parcourir chaque produit du panier.
    for (const produit of panier) {
      // Pour calculer le total, on additionne ce qu'on a déjà (prixTotal)
      // avec le (prix du produit multiplié par sa quantité).
      prixTotal = prixTotal + (produit.price * produit.quantity);
    }

    // Le calcul est terminé. On appelle notre méthode pour envoyer la notification.
    this.notifier(prixTotal);

    // On renvoie le prix final pour que le test "expect(prixFinal).toBe(...)" puisse faire sa vérification.
    return prixTotal;
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
