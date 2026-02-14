// src/services/geminiService.js
// Gemini AI integration for safety insights using Google Generative AI SDK
// Uses the Firebase project's API key to access Gemini via the generativelanguage API

import { GoogleGenerativeAI } from '@google/generative-ai'

// Read Gemini API key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI = null
let model = null

function getModel() {
  if (!model) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  }
  return model
}

/**
 * Generate a neighbourhood safety summary based on nearby incidents
 */
export async function generateNeighborhoodSummary(lat, lon, incidents = []) {
  try {
    const m = getModel()

    const incidentList = incidents.slice(0, 20).map((inc, i) => {
      const time = inc.timestamp?.toDate
        ? inc.timestamp.toDate().toLocaleString()
        : 'recently'
      return `${i + 1}. [${inc.type}] "${inc.description || 'No description'}" at (${inc.latitude ?? inc.lat}, ${inc.longitude ?? inc.lon}) — ${time}`
    }).join('\n')

    const prompt = `You are a public safety analyst AI for ShieldSync, a community safety app in Johor Bahru, Malaysia.

Given the user's location (${lat.toFixed(4)}, ${lon.toFixed(4)}) and the following ${incidents.length} recent incidents reported within 5km:

${incidentList || 'No recent incidents reported.'}

Provide a concise neighborhood safety summary in 3-4 sentences. Include:
1. Overall safety assessment (safe/moderate/elevated concern)
2. Most common incident types and patterns
3. Specific areas or times to be cautious
4. One actionable safety tip

Keep the tone reassuring but honest. Use simple language.`

    const result = await m.generateContent(prompt)
    const response = result.response
    const text = response.text()
    console.log('[ShieldSync] Gemini neighborhood summary generated')
    return { success: true, summary: text }
  } catch (error) {
    console.error('[ShieldSync] Gemini neighborhood summary error:', error)
    return {
      success: false,
      summary: generateFallbackNeighborhoodSummary(incidents),
    }
  }
}

/**
 * Generate user contribution summary
 */
export async function generateUserContributionSummary(userStats, recentIncidents = []) {
  try {
    const m = getModel()

    const userIncidents = recentIncidents.slice(0, 10).map((inc, i) =>
      `${i + 1}. [${inc.type}] "${inc.description || 'No description'}"`
    ).join('\n')

    const prompt = `You are a motivational public safety analyst AI for ShieldSync app in Johor Bahru, Malaysia.

This user has contributed:
- Total Points: ${userStats.totalPoints || 0}
- Total Reports: ${userStats.incidentCount || 0}
- Recent reports this week:
${userIncidents || 'None this week.'}

Generate a short 2-3 sentence motivational contribution summary for this user. Acknowledge their efforts, mention their impact on community safety, and encourage continued participation. Be warm and appreciative. Mention specific incident types if available.`

    const result = await m.generateContent(prompt)
    const text = result.response.text()
    console.log('[ShieldSync] Gemini user contribution summary generated')
    return { success: true, summary: text }
  } catch (error) {
    console.error('[ShieldSync] Gemini user contribution error:', error)
    return {
      success: false,
      summary: generateFallbackUserSummary(userStats),
    }
  }
}

/**
 * Generate safety tips based on incident patterns
 */
export async function generateSafetyTips(incidents = []) {
  try {
    const m = getModel()

    const typeCount = {}
    incidents.forEach(inc => {
      typeCount[inc.type] = (typeCount[inc.type] || 0) + 1
    })

    const prompt = `You are a safety advisor AI for ShieldSync app in Johor Bahru, Malaysia.

Recent incident breakdown in the area:
${Object.entries(typeCount).map(([type, count]) => `- ${type}: ${count} reports`).join('\n') || 'No recent incidents.'}

Generate exactly 3 specific, actionable safety tips based on the incident patterns above. Format each as a single sentence starting with an emoji. Keep them practical and relevant to Johor Bahru.`

    const result = await m.generateContent(prompt)
    const text = result.response.text()
    const tips = text.split('\n').filter(line => line.trim().length > 0).slice(0, 3)
    console.log('[ShieldSync] Gemini safety tips generated')
    return { success: true, tips }
  } catch (error) {
    console.error('[ShieldSync] Gemini safety tips error:', error)
    return {
      success: false,
      tips: [
        '🔒 Stay aware of your surroundings, especially in quiet areas after dark.',
        '📱 Keep ShieldSync notifications on to receive real-time community alerts.',
        '👥 Travel in groups when possible and share your location with trusted contacts.',
      ],
    }
  }
}

// ---- Fallback summaries when API is unavailable ----

function generateFallbackNeighborhoodSummary(incidents) {
  if (!incidents.length) {
    return 'Your neighborhood appears calm with no recent incidents reported. Stay vigilant and continue reporting any suspicious activity to help keep the community safe.'
  }
  const typeCount = {}
  incidents.forEach(inc => { typeCount[inc.type] = (typeCount[inc.type] || 0) + 1 })
  const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]
  return `There have been ${incidents.length} incident(s) reported nearby in the last 12 hours. The most common type is "${topType[0]}" with ${topType[1]} report(s). Stay aware of your surroundings and report any suspicious activity through ShieldSync.`
}

function generateFallbackUserSummary(stats) {
  if (!stats.incidentCount) {
    return 'Start contributing to community safety by reporting incidents you observe. Every report helps keep Johor Bahru safer!'
  }
  return `You've submitted ${stats.incidentCount} report(s) and earned ${stats.totalPoints || 0} points. Your contributions are making the community safer — keep it up!`
}
