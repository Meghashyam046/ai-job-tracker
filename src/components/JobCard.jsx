import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJobs } from '../context/JobContext'
import { MapPin, Briefcase, Clock, DollarSign, Bookmark, Send, ChevronDown, ChevronUp } from 'lucide-react'
import MatchScoreBadge from './MatchScoreBadge'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false)
  const { saveJob, applyToJob, savedJobs, applications } = useJobs()

  const isSaved = savedJobs.some((j) => j.id === job.id)
  const hasApplied = applications.some((app) => app.jobId === job.id)

  const handleSave = (e) => {
    e.stopPropagation()
    saveJob(job.id)
  }

  const handleApply = (e) => {
    e.stopPropagation()
    applyToJob(job.id)
  }

  return (
    <motion.div
      layout
      className="card-hover cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {job.title}
              </h3>
              {job.matchScore > 0 && <MatchScoreBadge score={job.matchScore} />}
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {job.company}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {job.jobType}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.workMode}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-secondary text-white'
                  : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-secondary/10 hover:text-secondary'
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="badge badge-primary"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="badge bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-gray-200 dark:border-dark-border"
            >
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Job Description
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Requirements
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Benefits
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Posted {format(new Date(job.postedDate), 'MMM dd, yyyy')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  disabled={hasApplied}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                    hasApplied
                      ? 'bg-gray-300 dark:bg-dark-border text-gray-500 dark:text-gray-600 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {hasApplied ? 'Applied' : 'Apply Now'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default JobCard
