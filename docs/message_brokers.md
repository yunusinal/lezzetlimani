
# Message Brokers

Bu belge, Lezzetlimani projesi içinde Redis ve Kafka kullanımını açıklar.

## Redis

Redis, çeşitli servislerde önbellekleme ve oturum yönetimi için kullanılmaktadır.

### Configuration

- **Adres Servisi:** Redis'e `REDIS_URL` ortam değişkenini kullanarak bağlanır.
- **Kimlik Doğrulama Servisi:** Redis'e `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` ve `REDIS_DB` ortam değişkenlerini kullanarak bağlanır.
- **Sepet Servisi:** Redis'e `REDIS_URL` ortam değişkenini kullanarak bağlanır.
- **Kullanıcı Servisi:** Redis'e `REDIS_URL` ortam değişkenini kullanarak bağlanır.

### Usage

- **Kimlik Doğrulama Servisi:**
  - Kara listeye alınacak JWT'leri önbellekler.
  - Yenileme tokenlarını yönetir.
  - Başarısız giriş denemelerini sınırlar.
  - E-posta doğrulama ve şifre sıfırlama için tokenleri saklar.
- **Sepet Servisi:**
  - Anonim kullanıcı sepetlerini saklar.
- **Kullanıcı Servisi:**
  - Bekleyen kullanıcı oluşturma durumunu yönetir.

## Kafka

Kafka, servisler arası asenkron iletişim için kullanılmaktadır.

### Configuration

- **Kimlik Doğrulama Servisi:** Kafka'ya `KAFKA_BROKERS` ortam değişkenini kullanarak bağlanır.
- **Bildirim Servisi:** Kafka'ya `KAFKA_BROKERS` ortam değişkenini kullanarak bağlanır.
- **Restoran Servisi:** Kafka'ya sabit kodlanmış broker adresi (`kafka:9092`) kullanarak bağlanır.
- **Kullanıcı Servisi:** Kafka'ya `KAFKA_BOOTSTRAP_SERVERS` ortam değişkenini kullanarak bağlanır.

### Konular

- `user_created`: Kimlik Doğrulama servisinde yeni bir kullanıcı oluşturulduğunda Kullanıcı servisini bilgilendirmek için kullanılır.
- `email_event`: Bildirim servisine e-posta olaylarını göndermek için kullanılır.
- `notification`: Restoran servisi tarafından bildirimleri göndermek için kullanılır.

### Usage

- **Kimlik Doğrulama Servisi:**
  - Yeni bir kullanıcı oluşturulduğunda `user_created` olayını yayınlar.
  - Bir e-posta gönderilmesi gerektiğinde (örneğin, e-posta doğrulama veya şifre sıfırlama için) `email_event` olayını yayınlar.
- **Bildirim Servisi:**
  - E-posta göndermek için `email_event` mesajlarını tüketir.
- **Restoran Servisi:**
  - `notification` olaylarını yayınlar.
- **Kullanıcı Servisi:**
  - Kendi veritabanında yeni bir kullanıcı oluşturmak için `user_created` olaylarını tüketir.
