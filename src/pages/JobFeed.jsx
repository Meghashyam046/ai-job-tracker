import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useJobs } from '../context/JobContext'
import JobCard from '../components/JobCard'
import FilterPanel from '../components/FilterPanel'
import { Briefcase, Filter } from 'lucide-react'
import { fadeIn, staggerContainer } from '../utils/motion'
import { calculateMatchScore } from '../utils/jobMatchingAlgorithm'

const JobFeed = () => {
  const { isAuthenticated } = useAuth()
  const { filteredJobs, userResume } = useJobs()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const jobsWithScores = filteredJobs.map((job) => ({
    ...job,
    matchScore: userResume ? calculateMatchScore(job, userResume) : 0,
  })).sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={fadeIn} className="glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
                <Briefcase className="w-8 h-8" />
                Job Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover opportunities tailored to your skills
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeIn} className="lg:col-span-1">
            <FilterPanel />
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="lg:col-span-3"
          >
            {jobsWithScores.length === 0 ? (
              <div className="panel text-center py-16">
                <Briefcase className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {jobsWithScores.map((job, index) => (
                  <motion.div
                    key={job.id}
                    variants={fadeIn}
                    transition={{ delay: index * 0.05 }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default JobFeed
