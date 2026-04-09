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
});
