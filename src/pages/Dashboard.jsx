import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useJobs } from '../context/JobContext'
import { Briefcase, BookmarkCheck, FileText, TrendingUp, Calendar, MapPin } from 'lucide-react'
import { fadeIn, staggerContainer } from '../utils/motion'
import ResumeUpload from '../components/ResumeUpload'
import { format } from 'date-fns'

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const { savedJobs, applications, userResume } = useJobs()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const stats = [
    {
      label: 'Applications',
      value: applications.length,
      icon: Briefcase,
      color: 'from-primary to-primary-dark',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Saved Jobs',
      value: savedJobs.length,
      icon: BookmarkCheck,
      color: 'from-secondary to-pink-600',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'Active Applications',
      value: applications.filter((app) => 
        ['Applied', 'Under Review', 'Interview Scheduled'].includes(app.status)
      ).length,
      icon: TrendingUp,
      color: 'from-success to-emerald-600',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Resume Status',
      value: userResume ? 'Uploaded' : 'Not Uploaded',
      icon: FileText,
      color: 'from-warning to-amber-600',
      bgColor: 'bg-warning/10',
    },
  ]

  const recentApplications = applications.slice(0, 5).sort(
    (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
  )

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

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={fadeIn} className="glass-card p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your job applications and discover new opportunities
              </p>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="btn-primary"
            >
              Browse Jobs
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                className="card-hover"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {!userResume && (
          <motion.div variants={fadeIn}>
            <ResumeUpload />
          </motion.div>
        )}

        <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="panel">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Recent Applications
            </h2>
            {recentApplications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No applications yet
                </p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="btn-outline"
                >
                  Start Applying
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-dark-border cursor-pointer"
                    onClick={() => navigate('/applications')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {app.job.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {app.job.company}
                        </p>
                      </div>
                      <span className={`badge ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(app.appliedDate), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {app.job.location}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookmarkCheck className="w-6 h-6 text-secondary" />
              Saved Jobs
            </h2>
            {savedJobs.length === 0 ? (
              <div className="text-center py-12">
                <BookmarkCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No saved jobs yet
                </p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="btn-outline"
                >
                  Explore Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJobs.slice(0, 5).map((job) => (
                  <motion.div
                    key={job.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-dark-border cursor-pointer"
                    onClick={() => navigate('/jobs')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.company}
                        </p>
                      </div>
                      <span className="badge badge-primary">{job.jobType}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span>{job.workMode}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard
