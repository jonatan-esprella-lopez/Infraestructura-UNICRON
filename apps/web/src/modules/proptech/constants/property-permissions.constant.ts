export const PROPTECH_PERMISSIONS = {
  PROPERTY_CREATE: 'proptech.property.create',
  PROPERTY_READ: 'proptech.property.read',
  PROPERTY_UPDATE: 'proptech.property.update',
  PROPERTY_DELETE: 'proptech.property.delete',
  PROPERTY_PUBLISH: 'proptech.property.publish',
  PROPERTY_ARCHIVE: 'proptech.property.archive',

  MEDIA_UPLOAD: 'proptech.media.upload',
  MEDIA_DELETE: 'proptech.media.delete',

  DOCUMENT_UPLOAD: 'proptech.document.upload',
  DOCUMENT_VERIFY: 'proptech.document.verify',
  DOCUMENT_REVIEW_AI: 'proptech.document.review_ai',

  VISIT_CREATE: 'proptech.visit.create',
  VISIT_UPDATE: 'proptech.visit.update',
  VISIT_CANCEL: 'proptech.visit.cancel',
  VISIT_COMPLETE: 'proptech.visit.complete',

  MATCHING_READ: 'proptech.matching.read',
  MATCHING_GENERATE: 'proptech.matching.generate',

  CONTRACT_CREATE: 'proptech.contract.create',
  CONTRACT_REVIEW_AI: 'proptech.contract.review_ai',
  CONTRACT_APPROVE: 'proptech.contract.approve',

  ANALYTICS_READ: 'proptech.analytics.read',
  MARKET_INSIGHTS_READ: 'proptech.market_insights.read',
} as const;
