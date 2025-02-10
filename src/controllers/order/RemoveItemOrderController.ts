import { Request, Response } from "express";
import { RemoveItemOrderService } from "../../services/order/RemoveItemOrderService";

class RemoveItemOrderController {
  async handle(req: Request, res: Response) {
    const item_id = req.query.item_id as string;
    const removeItemService = new RemoveItemOrderService();
    const order = await removeItemService.execute({ item_id });
    return res.json(order);
  }
}

export { RemoveItemOrderController };
