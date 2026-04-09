import cors from "cors";
import express, { Request, Response } from "express";
import { CalculatePriceUseCase, Discount } from "../../app/calcul-price.usecase";

const app = express();
app.use(express.json());
app.use(cors());

// route connecté au frontend
app.post("/totalPrice", (request: Request, response: Response) => {
  // Le frontend envoie le panier et le nom du coupon
  const produitsDemandés = request.body.products || [];
  const codePromoEcrit = request.body.reductionCode;

  // On transforme le code tapé par le client en un objet "Discount" que notre UseCase comprend
  const promotionsAAppliquer: Discount[] = [];

  // Si le client a tapé "10" dans la case sur le site
  if (codePromoEcrit === "10") {
    promotionsAAppliquer.push({ type: "PERCENTAGE", value: 10 });
  }

  // On utilise le UseCase
  const useCase = new CalculatePriceUseCase();
  const prixFinal = useCase.execute(produitsDemandés, promotionsAAppliquer);

  // On renvoie le prix au Frontend
  response.json(prixFinal);
});

app.get("/baskets", (request: Request, response: Response) => { });

export default app;
