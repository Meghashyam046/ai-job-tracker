import { motion } from 'framer-motion'
import { CheckCircle, Clock, XCircle, Calendar } from 'lucide-react'
import { format } from 'date-fns'

const ApplicationTimeline = ({ timeline }) => {
  const getStatusIcon = (status) => {
    const icons = {
      'Applied': Clock,
      'Under Review': Clock,
      'Interview Scheduled': Calendar,
      'Offer Received': CheckCircle,
      'Rejected': XCircle,
    }
    return icons[status] || Clock
  }

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'text-primary bg-primary/10',
      'Under Review': 'text-warning bg-warning/10',
      'Interview Scheduled': 'text-secondary bg-secondary/10',
      'Offer Received': 'text-success bg-success/10',
      'Rejected': 'text-danger bg-danger/10',
    }
    return colors[status] || 'text-gray-500 bg-gray-100'
  }

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Application Timeline
      </h4>
      <div className="space-y-4">
        {timeline.map((event, index) => {
          const Icon = getStatusIcon(event.status)
          const isLast = index === timeline.length - 1

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {!isLast && (
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-dark-border mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {event.status}
                  </h5>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {event.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ApplicationTimeline
