'use client'
import dynamic from 'next/dynamic'
import type { PWAModule } from './registry'

// Map clé → widget (lazy loaded)
const WIDGET_MAP: Record<string, React.ComponentType<{ config?: Record<string,string> }>> = {
  pwa_booking:              dynamic(() => import('./booking/widget')),
  pwa_queue_status:         dynamic(() => import('./queue-status/widget')),
  pwa_chat:                 dynamic(() => import('./chat/widget')),
  pwa_payment:              dynamic(() => import('./payment/widget')),
  pwa_medication_reminders: dynamic(() => import('./medication-reminders/widget')),
  pwa_loyalty:              dynamic(() => import('./loyalty/widget')),
  pwa_records:              dynamic(() => import('./records/widget')),
  pwa_documents:            dynamic(() => import('./documents/widget')),
  pwa_teleconsult:          dynamic(() => import('./teleconsult/widget')),
  pwa_feedback:             dynamic(() => import('./feedback/widget')),
  pwa_lab_results:          dynamic(() => import('./lab-results/widget')),
  pwa_pharmacy:             dynamic(() => import('./pharmacy/widget')),
  pwa_emergency:            dynamic(() => import('./emergency/widget')),
  pwa_referral:             dynamic(() => import('./referral/widget')),
  pwa_notifications:        dynamic(() => import('./notifications/widget')),
  vitrine_hero:             dynamic(() => import('./vitrine-hero/widget')),
  vitrine_about:            dynamic(() => import('./vitrine-about/widget')),
  vitrine_services:         dynamic(() => import('./vitrine-services/widget')),
  vitrine_gallery:          dynamic(() => import('./vitrine-gallery/widget')),
  vitrine_team:             dynamic(() => import('./vitrine-team/widget')),
  vitrine_testimonials:     dynamic(() => import('./vitrine-testimonials/widget')),
  vitrine_partners:         dynamic(() => import('./vitrine-partners/widget')),
  vitrine_faq:              dynamic(() => import('./vitrine-faq/widget')),
  vitrine_pricing:          dynamic(() => import('./vitrine-pricing/widget')),
  vitrine_awards:           dynamic(() => import('./vitrine-awards/widget')),
  vitrine_timeline:         dynamic(() => import('./vitrine-timeline/widget')),
  vitrine_portfolio:        dynamic(() => import('./vitrine-portfolio/widget')),
  vitrine_blog:             dynamic(() => import('./vitrine-blog/widget')),
  vitrine_press:            dynamic(() => import('./vitrine-press/widget')),
  vitrine_video_bg:         dynamic(() => import('./vitrine-video-bg/widget')),
  vitrine_countdown:        dynamic(() => import('./vitrine-countdown/widget')),
  util_notifications:      dynamic(() => import('./util-notifications/widget')),
  util_chat_support:       dynamic(() => import('./util-chat-support/widget')),
  util_feedback:           dynamic(() => import('./util-feedback/widget')),
  util_contact:            dynamic(() => import('./util-contact/widget')),
  util_map:                dynamic(() => import('./util-map/widget')),
  util_qr_scanner:         dynamic(() => import('./util-qr-scanner/widget')),
  util_barcode:            dynamic(() => import('./util-barcode/widget')),
  util_offline_mode:       dynamic(() => import('./util-offline-mode/widget')),
  util_multi_lang:         dynamic(() => import('./util-multi-lang/widget')),
  util_dark_mode:          dynamic(() => import('./util-dark-mode/widget')),
  util_accessibility:      dynamic(() => import('./util-accessibility/widget')),
  util_share:              dynamic(() => import('./util-share/widget')),
  util_pdf_export:         dynamic(() => import('./util-pdf-export/widget')),
  util_calendar_sync:      dynamic(() => import('./util-calendar-sync/widget')),
  util_2fa:                dynamic(() => import('./util-2fa/widget')),
  util_biometric:          dynamic(() => import('./util-biometric/widget')),
  util_onboarding_tour:    dynamic(() => import('./util-onboarding-tour/widget')),
  util_search:             dynamic(() => import('./util-search/widget')),
  util_filter_sort:        dynamic(() => import('./util-filter-sort/widget')),
  util_infinite_scroll:    dynamic(() => import('./util-infinite-scroll/widget')),
  util_widget_home:        dynamic(() => import('./util-widget-home/widget')),
}

interface Props {
  moduleKey: string
  moduleConfig?: Record<string, string>
  fallback?: React.ReactNode
}

export function ModuleWidget({ moduleKey, moduleConfig, fallback }: Props) {
  const Widget = WIDGET_MAP[moduleKey]
  if (!Widget) return <>{fallback || null}</>
  return <Widget config={moduleConfig} />
}
