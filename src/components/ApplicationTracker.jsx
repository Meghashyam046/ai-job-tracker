import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useJobs } from '../context/JobContext'
import ApplicationTimeline from './ApplicationTimeline'
import { Briefcase, Calendar, MapPin, TrendingUp } from 'lucide-react'
import { fadeIn, staggerContainer } from '../utils/motion'
import { format } from 'date-fns'

const ApplicationTracker = () => {
  const { isAuthenticated } = useAuth()
  const { applications } = useJobs()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'badge-primary',
      'Under Review': 'badge-warning',
      'Interview Scheduled': 'badge-secondary',
      'Offer Received': 'badge-success',
      'Rejected': 'badge-danger',
    }
    return colors[status] || 'badge-primary'
  }

  const statusStats = {
    total: applications.length,
    active: applications.filter((app) =>
      ['Applied', 'Under Review', 'Interview Scheduled'].includes(app.status)
    ).length,
    offers: applications.filter((app) => app.status === 'Offer Received').length,
    rejected: applications.filter((app) => app.status === 'Rejected').length,
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={fadeIn} className="glass-card p-6">
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
            <Briefcase className="w-8 h-8" />
            Application Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your job application progress
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-primary">
                  {statusStats.total}
                </p>
              </div>
              <Briefcase className="w-10 h-10 text-primary/30" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Active
                </p>
                <p className="text-3xl font-bold text-warning">
                  {statusStats.active}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-warning/30" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Offers
                </p>
                <p className="text-3xl font-bold text-success">
                  {statusStats.offers}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-success/30" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-danger/10 to-danger/5 border-danger/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-danger">
                  {statusStats.rejected}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-danger/30" />
            </div>
          </div>
        </motion.div>

        {applications.length === 0 ? (
          <motion.div variants={fadeIn} className="panel text-center py-16">
            <Briefcase className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start applying to jobs to track your progress here
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="btn-primary"
            >
              Browse Jobs
            </button>
          </motion.div>
        ) : (
          <motion.div variants={fadeIn} className="space-y-4">
            {applications
              .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
              .map((application, index) => (
                <motion.div
                  key={application.id}
                  variants={fadeIn}
                  transition={{ delay: index * 0.05 }}
                  className="panel"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {application.job.title}
                        </h3>
                        <span className={`badge ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {application.job.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {application.job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied {format(new Date(application.appliedDate), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {application.job.jobType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ApplicationTimeline timeline={application.timeline} />
                </motion.div>
              ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ApplicationTracker
