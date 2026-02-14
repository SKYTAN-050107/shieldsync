import { 
  calculateSafetyScore, 
  generateSafetyInsights,
  predictRiskTrend 
} from './safetyAnalytics'

/**
 * Generate AI-powered safety alerts
 */
export const generateAIAlerts = (location, incidents, services) => {
  const safetyAnalysis = calculateSafetyScore(location, incidents, services)
  const insights = generateSafetyInsights(location, incidents, services, safetyAnalysis.score)
  const trend = predictRiskTrend(incidents)
  
  // Find nearest police station (safe shelter)
  const police = services
    .filter(s => s.type === 'police')
    .sort((a, b) => a.distance - b.distance)[0]
  
  return {
    overallSafety: {
      score: safetyAnalysis.score,
      risk: safetyAnalysis.risk,
      message: getRiskMessage(safetyAnalysis.risk),
      trend
    },
    nearestShelter: police,
    recommendations: insights,
    safestRoute: {
      suggestion: 'Stay on main roads with good lighting',
      avoid: incidents
        .filter(inc => inc.severity === 'high')
        .map(inc => inc.location)
    }
  }
}

const getRiskMessage = (risk) => {
  const messages = {
    low: '✅ Low risk area. Enjoy your day safely!',
    medium: '⚠️ Moderate risk. Stay alert and avoid dark areas.',
    high: '🚨 High risk detected. Consider alternate routes or travel in groups.'
  }
  return messages[risk] || messages.medium
}
