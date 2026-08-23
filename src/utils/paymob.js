import axios from "axios";
import {
  paymobApiKey,
  paymobIframeId,
  paymobIntegrationIdCard,
  paymobIntegrationIdWallet,
} from "../config/env.js";
import { ApiError } from "../middlewares/errorHandler.js";

const BASE_URL = "https://accept.paymob.com/api";

function assertPaymobConfig() {
  if (!paymobApiKey) {
    throw new ApiError("Paymob API key is not configured", 500);
  }
  if (!paymobIframeId) {
    throw new ApiError("Paymob iframe id is not configured", 500);
  }
}

export async function getPaymobAuthToken() {
  assertPaymobConfig();

  try {
    const response = await axios.post(`${BASE_URL}/auth/tokens`, {
      api_key: paymobApiKey,
    });

    const token = response?.data?.token;
    if (!token) {
      throw new ApiError("Unable to authenticate with Paymob", 502);
    }

    return token;
  } catch (error) {
    throw new ApiError(
      error?.response?.data?.message || "Paymob authentication failed",
      502,
    );
  }
}

export async function createPaymobOrder({ amountCents, merchantOrderId }) {
  const authToken = await getPaymobAuthToken();

  try {
    const response = await axios.post(`${BASE_URL}/ecommerce/orders`, {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: merchantOrderId,
      items: [],
    });

    const orderId = response?.data?.id;
    if (!orderId) {
      throw new ApiError("Failed to create Paymob order", 502);
    }

    return orderId;
  } catch (error) {
    throw new ApiError(
      error?.response?.data?.message || "Paymob order creation failed",
      502,
    );
  }
}

export async function createPaymobPaymentKey({
  amountCents,
  orderId,
  integrationId,
  billingData = {},
}) {
  if (!integrationId) {
    throw new ApiError("Paymob integration id is not configured", 500);
  }

  const authToken = await getPaymobAuthToken();

  try {
    const response = await axios.post(`${BASE_URL}/acceptance/payment_keys`, {
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: billingData,
      currency: "EGP",
      integration_id: integrationId,
    });

    const token = response?.data?.token;
    const paymentKeyId = response?.data?.id;

    if (!token) {
      throw new ApiError("Failed to create Paymob payment key", 502);
    }

    return {
      paymentToken: token,
      paymentKeyId: paymentKeyId || 0,
    };
  } catch (error) {
    throw new ApiError(
      error?.response?.data?.message || "Paymob payment key creation failed",
      502,
    );
  }
}

export function buildPaymobPaymentUrl(paymentToken) {
  assertPaymobConfig();
  return `https://accept.paymob.com/api/acceptance/iframes/${paymobIframeId}?payment_token=${paymentToken}`;
}
