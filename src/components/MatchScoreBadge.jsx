import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const MatchScoreBadge = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 90) return 'from-success to-emerald-600'
    if (score >= 70) return 'from-warning to-amber-600'
    return 'from-danger to-red-600'
  }

  const getScoreText = () => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 70) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getScoreColor()} text-white shadow-lg`}
    >
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-bold">{score}%</span>
      <span className="text-xs font-medium">{getScoreText()}</span>
    </motion.div>
  )
}

export default MatchScoreBadge
