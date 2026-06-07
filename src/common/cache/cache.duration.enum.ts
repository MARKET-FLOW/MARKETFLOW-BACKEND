export enum CacheDuration {
  // Durées de base — référencées par les membres sémantiques
  FIVE_MINUTES = 300,
  TEN_MINUTES = 60 * 10,
  FIFTEEN_MIN = 900,
  HALF_HOUR = 1800,
  ONE_HOUR = 3600,
  TWO_HOURS = 60 * 60 * 2,
  TWENTY_FOUR_H = 86400,

  // Durées sémantiques par domaine — lisibles dans les services
  USER_DURATION = CacheDuration.FIFTEEN_MIN,
  STORE_DURATION = CacheDuration.TWENTY_FOUR_H,
  CATEGORY_DURATION = CacheDuration.TWENTY_FOUR_H,
  LISTE_CATEGORIES_DURATION = CacheDuration.TWENTY_FOUR_H,
  PRODUCT_DURATION = CacheDuration.ONE_HOUR,
  LISTE_PRODUCTS_DURATION = CacheDuration.FIVE_MINUTES,
  DEVICE_DURATION = CacheDuration.HALF_HOUR,
  LISTE_USERS_DURATION = CacheDuration.TEN_MINUTES,
  PAIRING_TOKEN_DURATION = CacheDuration.FIVE_MINUTES,
  AUTH_SESSION_DURATION = CacheDuration.FIFTEEN_MIN,
}
