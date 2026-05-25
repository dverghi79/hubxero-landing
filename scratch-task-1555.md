# Scratch: task-1555 — Lead Magnet Retrofit for HubXero (bet-699)
> Protocol 8: Context Preservation

## Phase 1: Verdict Summary

- **Bet:** bet-699, HubXero, stage=lp_built, status=active
- **Lead magnet type:** reveal_problem
- **Lead magnet name:** "Free HubSpot-Xero Invoice Gap Report"
- **AI delivery classification:** full_ai_assisted
- **Delivery window:** Within 2 hours during business hours
- **CTA text (from spec):** "Upload your HubSpot and Xero exports. We'll send your invoice gap report within 2 hours."
- **Hero CTA button:** "Get Your Free Report" (second-person per memory rule)
- **Primary wedge:** HubSpot-Xero sync gap (post-March 2026 retirement)
- **ICP:** Finance Managers, RevOps leads at HubSpot+Xero companies in UK, AUS, NZ (20-200 employees)
- **Pricing:** TBD (founding access framing)
- **Bridge:** One-time gap report reveals unmatched deals/invoices -> HubXero connects systems permanently

## Deliverable Preview Bullets (from spec deliverable_scope)
1. Missing Invoice Tracker: HubSpot closed-won deals with no matching Xero invoice
2. Status Mismatch List: Xero invoices paid/voided where HubSpot deal still open
3. Overdue Invoice Flag: Xero invoices 30+ days overdue with no CRM follow-up
4. Revenue at Risk Summary: total deal value sitting in the gaps
5. One-paragraph recommendation: immediate manual steps for highest-risk missing invoices

## Intake Form Fields (from spec)
- Full name (required)
- Business email (required)
- Company name (required)
- Country dropdown (UK / Australia / New Zealand / Other)
- Company size (1-10 / 11-50 / 51-200 / 200+)
- Deals per month (1-5 / 6-20 / 21+)
- HubSpot export CSV (required, handled via email follow-up)
- Xero export CSV (required, handled via email follow-up)
- Current sync method (Zapier/Make / Manual / Nothing / Other)

## 7-Section Structure (from agent spec)
1. Hero (lead magnet CTA)
2. What You'll Receive
3. Founder Credibility
4. How It Works (3-step audit workflow)
5. Bridge to Paid
6. Report Intake Form
7. Footer

## Sections to DELETE
- Capabilities (id="product")
- The Problem (id="the-problem")
- Built For (id="built-for")
- Old hero product pitch
- Old waitlist section
- Proof badge section (integrate into Founder Credibility)

## Sections to PRESERVE
- Sticky header (update nav + CTA)
- Footer (keep as-is)
- All tracking (gtag, Clarity, Vercel Analytics, consent)
- Calendly (move to Bridge section)
