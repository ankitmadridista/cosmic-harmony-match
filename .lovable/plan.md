

# Kundli Matching (Kundali Milan) Web App

## Overview
A free, instant Kundli matching tool with a clean, modern-minimal design. Users enter birth details for two people and receive a comprehensive Ashtakoot (36 Guna Milan) compatibility report — no login required.

## API Integration
- **API**: Free Astrology API (freeastrologyapi.com) — free tier with 50 requests/day, provides Ashtakoot matching scores
- **Backend**: Supabase Edge Function to securely proxy API calls (API key stored as a secret)
- **Architecture**: Clean integration layer so API can be swapped or upgraded later

## Pages & Layout

### 1. Home / Input Page
- Hero section with app title, brief tagline about Kundli matching
- Two-column form (Boy's Details | Girl's Details) — stacks vertically on mobile
- **Input fields per person**: Full Name, Gender (pre-filled), Date of Birth (day/month/year pickers), Time of Birth (hour/minute, second optional), Birth Place (city autocomplete using a free geocoding service for coordinates & timezone)
- "Match Kundli" button with loading state
- Clean, white background with subtle Vedic-inspired accent colors (saffron/gold touches)

### 2. Results Page
- **Score Summary Card**: Large circular/gauge showing total Guna score out of 36 with color coding (Red < 18, Yellow 18-24, Light Green 24-32, Dark Green 32-36) and compatibility label
- **8 Koota Breakdown Table**: Each koota showing name, score obtained vs max, short explanation, and Good/Average/Needs Attention badge
- **Dosha Analysis Section**: Manglik Dosha status, Nadi Dosha, Bhakoot Dosha — with presence indicators and brief remedy suggestions when doshas exist
- **Overall Summary**: Marriage compatibility recommendation paragraph
- **Action buttons**: Download as PDF, Share result link, Reset/New Match

### 3. Educational Content Section (below results or as a separate tab)
- What is Kundli Matching?
- Importance of Guna Milan
- Role of Manglik Dosha
- Why compatibility score matters
- Disclaimer about astrology being interpretative
- SEO-optimized, authoritative content

## Key Features
- **Mobile-first responsive design** with modern minimal aesthetic
- **Input validation** on all fields with clear error messages
- **Timezone auto-detection** based on selected birth place
- **Loading skeleton** while API processes the request
- **PDF download** of the full compatibility report
- **Share functionality** (copy link or native share)
- **Error handling** with friendly messages if API is unavailable

## Technical Approach
- Lovable Cloud for edge function (API proxy) and secrets management
- City autocomplete using a free geocoding API for birth place + timezone lookup
- Client-side PDF generation for report download
- SEO meta tags and structured content
- Modular component architecture for future scalability

