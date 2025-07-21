**Resimlere tıklandığında ilgili youtube videosunda yönlendirilirsiniz.**

## Kullanıcı Auth işlemleri
[![addres](https://img.youtube.com/vi/Q1hnGiKgFkA/0.jpg)](https://www.youtube.com/watch?v=Q1hnGiKgFkA)



## Kullanıcı Adres işlemleri
[![addres](https://img.youtube.com/vi/Smo3xrhdCxs/0.jpg)](https://www.youtube.com/watch?v=Smo3xrhdCxs)

## Favorileme ve Filtreleme İşlemleri
[![fav and filter](https://img.youtube.com/vi/JdlhoY3H1nI/0.jpg)](https://www.youtube.com/watch?v=JdlhoY3H1nI)


## Sepet İşlemleri
[![cart](https://img.youtube.com/vi/JBTIM-D3D64/0.jpg)](https://www.youtube.com/watch?v=JBTIM-D3D64)


----
# İlgili İşlemler

### Authentication Service (`/auth`)

- **POST /register**: Yeni kullanıcı kaydı.
- **POST /login**: Kullanıcı girişi.
- **POST /verify-email**: Kullanıcı e-posta doğrulama.
- **POST /forgot-password**: Şifre sıfırlama sürecini başlat.
- **POST /reset-password**: Kullanıcı şifresini sıfırla.
- **POST /logout**: Kullanıcı çıkışı (korumalı).
- **GET /health**: Sağlık kontrolü.

### Address Service (`/addresses`)

- **POST /**: Kimliği doğrulanmış kullanıcı için yeni adres oluştur.
- **GET /**: Kimliği doğrulanmış kullanıcının tüm adreslerini getir.
- **GET /{address_id}**: ID'ye göre belirli bir adresi getir.
- **PUT /{address_id}**: ID'ye göre belirli bir adresi güncelle.
- **DELETE /{address_id}**: ID'ye göre belirli bir adresi sil.
- **GET /health**: Sağlık kontrolü.

## Cart Service (`/carts`)

### Anonymous Carts (`/anonymous`)

- **POST /generate-id**: Yeni anonim sepet ID'si oluştur.
- **POST /add**: Anonim sepete ürün ekle.
- **GET /{cart_id}**: ID'ye göre anonim sepeti getir.
- **PATCH /{cart_id}/items/{meal_id}**: Anonim sepetteki bir ürünü güncelle.
- **DELETE /{cart_id}/items/{meal_id}**: Anonim sepetten bir ürünü kaldır.
- **DELETE /{cart_id}/clear**: Anonim sepeti temizle.
- **GET /{cart_id}/validate**: Anonim sepeti doğrula.
- **POST /merge**: Anonim sepeti kullanıcı sepetiyle birleştir.
- **POST /{cart_id}/extend**: Anonim sepetin süresini uzat.
- **POST /cleanup**: Süresi dolmuş anonim sepetleri temizle (yönetici).

### User Carts

- **POST /add**: Kullanıcı sepetine ürün ekle.
- **GET /get**: Kullanıcı sepetindeki tüm ürünleri getir.
- **DELETE /remove/{meal_id}**: Kullanıcı sepetinden ürün kaldır.
- **DELETE /clear**: Kullanıcı sepetini temizle.
- **PATCH /update/{meal_id}**: Kullanıcı sepetindeki bir ürünü güncelle.
- **POST /checkout**: Kullanıcı sepetinden sipariş oluştur.
- **GET /orders**: Kullanıcının sipariş geçmişini getir.
- **GET /complementary/{meal_id}**: Belirli bir yemek için tamamlayıcı yemek önerileri al.

### Meal Service (`/meals`)

- **POST /**: Yeni yemek oluştur.
- **GET /{meal_id}**: ID'ye göre yemek getir.
- **GET /restaurant/{restaurant_id}**: Belirli bir restoranın tüm yemeklerini getir.
- **GET /{meal_id}/complementary**: Belirli bir yemek için tamamlayıcı yemekleri getir.

### Restaurant Service (`/restaurants`)

- **POST /**: Yeni restoran oluştur.
- **GET /{id}**: ID'ye göre restoran getir.
- **GET /**: Tüm restoranları opsiyonel filtreleme ile listele.
- **GET /search**: Gelişmiş filtreleme ile restoran ara.
- **GET /campaigns**: Tüm aktif kampanyaları listele.
- **POST /campaigns**: Yeni kampanya oluştur.

### User Service (`/users`)

- **GET /health**: Sağlık kontrolü.
- **GET /me**: Mevcut kullanıcı bilgilerini getir.
- **POST /register/complete**: Kullanıcı kaydını tamamla.
- **PUT /me**: Mevcut kullanıcı profilini güncelle.

### Favorites (`/favorites`)

- **POST /restaurant**: Kullanıcının favorilerine restoran ekle.
- **DELETE /restaurant/{restaurant_id}**: Kullanıcının favorilerinden restoran kaldır.
- **GET /restaurants**: Kullanıcının favori restoranlarını getir.
- **POST /cuisine**: Kullanıcının favorilerine mutfak ekle.
- **DELETE /cuisine/{cuisine}**: Kullanıcının favorilerinden mutfak kaldır.
- **GET /cuisines**: Kullanıcının favori mutfaklarını getir.
- **GET /**: Kullanıcının tüm favorilerini (restoranlar ve mutfaklar) getir.

