import { useEffect, useState } from "react";
import { getOrders } from "../../api/cart/cart";
import { useAuth } from "../../context/AuthContext";
import type { OrderResponse } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getOrders(user.id)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?.id) {
    return (
      <div className="p-8 text-center">
        Sipariş geçmişinizi görmek için giriş yapın.
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <h1 className="text-2xl font-bold mb-6">Sipariş Geçmişim</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div>Henüz hiç siparişiniz yok.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id} className="border-border bg-card">
              <CardHeader>
                <CardTitle>
                  #{order.id} - {new Date(order.created_at).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">Toplam: ₺{order.total.toFixed(2)}</div>
                {order.discount > 0 && (
                  <div>İndirim: ₺{order.discount.toFixed(2)}</div>
                )}
                <div>Ödeme Yöntemi: {order.payment_method}</div>
                {order.coupon_code && <div>Kupon: {order.coupon_code}</div>}
                <div className="mt-2">
                  <b>Ürünler:</b>
                  <ul className="list-disc ml-5">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.meal_id} × {item.quantity}{" "}
                        {item.note && `- Not: ${item.note}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
