import { describe, test, expect } from 'vitest';
import { Product } from '../app/calcul-price.usecase';
import { CalculatePriceUseCase } from '../app/calcul-price.usecase';


describe('CalculatePriceUseCase', () => {
  test('doit retourner le prix du produit si le panier contient un seul article', () => {
    const panier: Product[] = [
      { name: 'TSHIRT', quantity: 1, type: 'TSHIRT', price: 20 }
    ];

    const useCase = new CalculatePriceUseCase();


    const prixFinal = useCase.execute(panier);


    expect(prixFinal).toBe(20);
  });

  test('doit envoyer une notification au client avec le prix final calculé', () => {
    // On crée un panier très simple avec 1 seul pull à 40 euros.
    const panier: Product[] = [
      { name: 'PULL', quantity: 1, type: 'PULL', price: 40 }
    ];

    //  On crée un "Spy" (Espion) de notification.
    // `vi.fn()` va juste "noter secrètement" que la fonction a été appelée, avec quel prix, et combien de fois.
    const notificationSpy = {
      envoyer: vi.fn()
    };

    // On passe notre "Spy" à la création du UseCase. 
    const useCase = new CalculatePriceUseCase(notificationSpy);

    // On exécute le calcul. Appel "notificationSpy.envoyer(40)"
    useCase.execute(panier);

    // On interroge Vitest : "Est-ce que tu peux vérifier dans les notes de l'espion que la fonction 'envoyer' a bien reçu le chiffre 40 exactement ?"
    expect(notificationSpy.envoyer).toHaveBeenCalledWith(40);
  });

  // Réduction en pourcentage
  test('doit appliquer une réduction de 10% sur la commande', () => {
    // On met un pull à 100€ pour faire un calcul facile.
    const panier: Product[] = [
      { name: 'PULL', quantity: 1, type: 'PULL', price: 100 }
    ];

    // On prépare notre code promo
    const promotions = [
      { type: 'PERCENTAGE', value: 10 }
    ];

    const useCase = new CalculatePriceUseCase();

    // On passe le panier ET la promotion.
    // Erreur test (Rouge)
    const prixFinal = useCase.execute(panier, promotions);

    // 100€ - 10% = 90€
    expect(prixFinal).toBe(90);
  });

  // Réduction avec un montant fixe
  test('doit appliquer une réduction fixe de 30€ sur la commande', () => {
    const panier: Product[] = [
      { name: 'PULL', quantity: 1, type: 'PULL', price: 100 }
    ];

    const promotions = [
      { type: 'FIXED', value: 30 } // On crée un type FIXED pour signifier 30€ tout pile
    ];

    const useCase = new CalculatePriceUseCase();


    const prixFinal = useCase.execute(panier, promotions);

    // 100€ - 30€ = 70€.
    expect(prixFinal).toBe(70);
  });

  // Le prix ne doit jamais être négatif
  test('le prix final ne doit jamais être négatif', () => {
    const panier: Product[] = [
      { name: 'TSHIRT', quantity: 1, type: 'TSHIRT', price: 20 }
    ];

    const promotions = [
      { type: 'FIXED', value: 30 } // Réduction supérieure au prix du panier
    ];

    const useCase = new CalculatePriceUseCase();

    const prixFinal = useCase.execute(panier, promotions);

    // 20€ - 30€ = -10€, mais le système doit bloquer à 0€.
    expect(prixFinal).toBe(0);
  });

  // Promotion "Un acheté = Un offert" 
  test('doit appliquer la promotion un acheté = un offert', () => {
    // 3 T-SHIRTS achetés à 20€. 
    const panier: Product[] = [
      { name: 'TSHIRT', quantity: 3, type: 'TSHIRT', price: 20 }
    ];

    const promotions = [
      { type: 'UN_ACHETE_UN_OFFERT' }
    ];

    const useCase = new CalculatePriceUseCase();

    const prixFinal = useCase.execute(panier, promotions);

    // 1er T-shirt: payé (20€)
    // 2e T-shirt: offert (0€)
    // 3e T-shirt: payé (20€)
    // Total = 40€ au lieu de 60€
    expect(prixFinal).toBe(40);
  });

  // Black Friday
  describe('Black Friday', () => {
    test('doit appliquer une réduction de 50% pendant le week-end du Black Friday', () => {
      const panier: Product[] = [
        { name: 'PULL', quantity: 1, type: 'PULL', price: 100 }
      ];
      const promotions = [{ type: 'BLACK_FRIDAY' }];
      const dateBlackFriday = new Date('2025-11-29T12:00:00');

      const useCase = new CalculatePriceUseCase();

      const prixFinal = useCase.execute(panier, promotions, dateBlackFriday);

      expect(prixFinal).toBe(50);
    });

    test('ne doit pas appliquer de réduction Black Friday hors de la période', () => {
      const panier: Product[] = [
        { name: 'PULL', quantity: 1, type: 'PULL', price: 100 }
      ];
      const promotions = [{ type: 'BLACK_FRIDAY' }];
      const dateHorsPeriode = new Date('2025-11-27T12:00:00');

      const useCase = new CalculatePriceUseCase();

      const prixFinal = useCase.execute(panier, promotions, dateHorsPeriode);

      expect(prixFinal).toBe(100);
    });

    test('le prix final ne doit pas descendre en dessous de 1 euro pendant le Black Friday', () => {
      const panier: Product[] = [
        { name: 'TSHIRT', quantity: 1, type: 'TSHIRT', price: 1.5 }
      ];
      const promotions = [{ type: 'BLACK_FRIDAY' }];
      const dateBlackFriday = new Date('2025-11-29T12:00:00');

      const useCase = new CalculatePriceUseCase();

      const prixFinal = useCase.execute(panier, promotions, dateBlackFriday);

      // 1.5€ - 50% = 0.75€, mais le minimum Black Friday est 1€.
      expect(prixFinal).toBe(1);
    });
  });
});
