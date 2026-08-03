// Compatibility exports for legacy global declarations in types.d.ts.
// Domain migrations should move these contracts into focused type modules.
type GlobalAddressTypes = AddressTypes;
type GlobalArtworkPriceFilterData = ArtworkPriceFilterData;
type GlobalArtworkSchemaTypes = ArtworkSchemaTypes;
type GlobalCommitment = Commitment;
type GlobalCreateOrderModelTypes = CreateOrderModelTypes;
type GlobalGalleryProfileUpdateData = GalleryProfileUpdateData;
type GlobalGallerySignupData = GallerySignupData;
type GlobalIndividualRegisterData = IndividualRegisterData;
type GlobalInvoiceTypes = InvoiceTypes;
type GlobalNextChargeParams = NextChargeParams;
type GlobalOrderAcceptedStatusTypes = OrderAcceptedStatusTypes;
type GlobalPurchaseTransactionModelSchemaTypes =
  PurchaseTransactionModelSchemaTypes;
type GlobalRouteIdentifier = RouteIdentifier;
type GlobalSubscriptionModelSchemaTypes = SubscriptionModelSchemaTypes;
type GlobalSupportCategory = SupportCategory;
type GlobalUploadTrackingTypes = UploadTrackingTypes;
type GlobalArtworkListingType = artworkListingType;
type GlobalArtworkOrderDataTypes = artworkOrderDataTypes;

export type {
  GlobalAddressTypes as AddressTypes,
  GlobalArtworkListingType as artworkListingType,
  GlobalArtworkOrderDataTypes as artworkOrderDataTypes,
  GlobalArtworkPriceFilterData as ArtworkPriceFilterData,
  GlobalArtworkSchemaTypes as ArtworkSchemaTypes,
  GlobalCommitment as Commitment,
  GlobalCreateOrderModelTypes as CreateOrderModelTypes,
  GlobalGalleryProfileUpdateData as GalleryProfileUpdateData,
  GlobalGallerySignupData as GallerySignupData,
  GlobalIndividualRegisterData as IndividualRegisterData,
  GlobalInvoiceTypes as InvoiceTypes,
  GlobalNextChargeParams as NextChargeParams,
  GlobalOrderAcceptedStatusTypes as OrderAcceptedStatusTypes,
  GlobalPurchaseTransactionModelSchemaTypes as PurchaseTransactionModelSchemaTypes,
  GlobalRouteIdentifier as RouteIdentifier,
  GlobalSubscriptionModelSchemaTypes as SubscriptionModelSchemaTypes,
  GlobalSupportCategory as SupportCategory,
  GlobalUploadTrackingTypes as UploadTrackingTypes,
};

export type EntityType = "artist" | "gallery" | "individual" | "user";
