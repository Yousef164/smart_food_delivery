import { Order, User } from "../../models/index.js";
import { ApiError } from "../../middlewares/errorHandler";
import { isUser } from "../../middlewares/tokens.js";
import { Validator } from "../../utils/Validator.js";
import {
  createPaymobOrder,
  createPaymobPaymentKey,
  buildPaymobPaymentUrl,
} from "../../utils/paymob.js";

export class orderService {
  static async createOrder(user, data) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    const validation = Validator.validateCreateOrder(data);
    if (!validation.isValid) {
      throw new ApiError("validation field", 400, validation.errors);
    }

    const paymentMethod = String(data.paymentMethod || "")
      .trim()
      .toLowerCase();
    if (!["cash", "wallet", "card"].includes(paymentMethod)) {
      throw new ApiError("Invalid payment method", 400);
    }

    const totalPrice = Number(data.totalPrice);
    if (Number.isNaN(totalPrice) || totalPrice <= 0) {
      throw new ApiError("totalPrice must be a positive number", 400);
    }

    const orderData = {
      userId: data.userId || user?.id,
      addressId: data.addressId,
      totalPrice,
      paymentMethod,
      paymentStatus: "pending",
      paymobOrderId: 0,
      paymobTransactionId: 0,
    };

    let paymobPaymentUrl = null;

    if (paymentMethod === "card" || paymentMethod === "wallet") {
      const userRecord = await User.findByPk(user.id);
      const billingData = {
        first_name: userRecord?.fullName?.split(" ")[0] || "Customer",
        last_name:
          userRecord?.fullName?.split(" ").slice(1).join(" ") || "Customer",
        email: userRecord?.email || user.email || "no-reply@example.com",
        phone_number: userRecord?.phone || "",
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        city: "Cairo",
        state: "Cairo",
        country: "EG",
        postal_code: "00000",
      };

      const amountCents = Math.round(totalPrice * 100);
      const paymobOrderId = await createPaymobOrder({
        amountCents,
        merchantOrderId: `${user.id}-${Date.now()}`,
      });

      const integrationId =
        paymentMethod === "card"
          ? paymobIntegrationIdCard
          : paymobIntegrationIdWallet;

      const paymentKey = await createPaymobPaymentKey({
        amountCents,
        orderId: paymobOrderId,
        integrationId,
        billingData,
      });

      orderData.paymobOrderId = paymobOrderId;
      orderData.paymobTransactionId = 0;
      paymobPaymentUrl = buildPaymobPaymentUrl(paymentKey.paymentToken);
    }

    const createdOrder = await Order.create(orderData);

    return {
      order: createdOrder,
      ...(paymobPaymentUrl && { paymobPaymentUrl }),
    };
  }

  static async confirmPayment(data) {
    if (!data?.orderId) {
      throw new ApiError("orderId is required", 400);
    }

    const order = await Order.findByPk(data.orderId);
    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    if (order.paymentMethod === "cash") {
      throw new ApiError("Cannot confirm payment for cash orders", 400);
    }

    if (order.paymentStatus === "paid") {
      throw new ApiError("Order is already paid", 400);
    }

    if (order.paymentStatus === "failed") {
      throw new ApiError("Cannot confirm payment for failed orders", 400);
    }

    const paymobTransactionId = data.paymobTransactionId || 0;

    await order.update({
      paymentStatus: "paid",
      paymobTransactionId,
    });

    return order;
  }

  static async cancelOrder(user, data) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    const order = Order.findOne({
      where: { id: data.id },
    });

    if (!order) {
      throw new ApiError("Not found", 404);
    }

    await order.destroy();
    return { message: "Order canceled successfully" };
  }
}

export default orderService;
