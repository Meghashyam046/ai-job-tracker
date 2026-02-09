import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { mockJobs } from '../data/mockJobsData'
import { calculateMatchScore } from '../utils/jobMatchingAlgorithm'

const JobContext = createContext()

export const useJobs = () => {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error('useJobs must be used within JobProvider')
  }
  return context
}

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState(mockJobs)
  const [savedJobs, setSavedJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [userResume, setUserResume] = useState(null)
  const [filters, setFilters] = useState({
    role: '',
    skills: [],
    location: '',
    jobType: '',
    workMode: '',
    minMatchScore: 0,
    datePosted: 'all',
  })

  useEffect(() => {
    const stored = localStorage.getItem('savedJobs')
    if (stored) setSavedJobs(JSON.parse(stored))

    const storedApps = localStorage.getItem('applications')
    if (storedApps) setApplications(JSON.parse(storedApps))

    const storedResume = localStorage.getItem('userResume')
    if (storedResume) setUserResume(JSON.parse(storedResume))
  }, [])

  useEffect(() => {
    let filtered = [...jobs]

    if (filters.role) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(filters.role.toLowerCase())
      )
    }

    if (filters.skills.length > 0) {
      filtered = filtered.filter((job) =>
        filters.skills.some((skill) =>
          job.skills.some((jobSkill) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      )
    }

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.jobType) {
      filtered = filtered.filter((job) => job.jobType === filters.jobType)
    }

    if (filters.workMode) {
      filtered = filtered.filter((job) => job.workMode === filters.workMode)
    }

    if (filters.minMatchScore > 0 && userResume) {
      filtered = filtered.filter(
        (job) => calculateMatchScore(job, userResume) >= filters.minMatchScore
      )
    }

    if (filters.datePosted !== 'all') {
      const now = new Date()
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.postedDate)
        const diffDays = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24))

        if (filters.datePosted === 'today') return diffDays === 0
        if (filters.datePosted === 'week') return diffDays <= 7
        if (filters.datePosted === 'month') return diffDays <= 30
        return true
      })
    }

    setFilteredJobs(filtered)
  }, [filters, jobs, userResume])

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      role: '',
      skills: [],
      location: '',
      jobType: '',
      workMode: '',
      minMatchScore: 0,
      datePosted: 'all',
    })
    toast.success('Filters reset')
  }

  const saveJob = (jobId) => {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return

    if (savedJobs.some((j) => j.id === jobId)) {
      const updated = savedJobs.filter((j) => j.id !== jobId)
      setSavedJobs(updated)
      localStorage.setItem('savedJobs', JSON.stringify(updated))
      toast.success('Job removed from saved')
    } else {
      const updated = [...savedJobs, job]
      setSavedJobs(updated)
      localStorage.setItem('savedJobs', JSON.stringify(updated))
      toast.success('Job saved successfully')
    }
  }

  const applyToJob = (jobId) => {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return

    if (applications.some((app) => app.jobId === jobId)) {
      toast.error('You have already applied to this job')
      return
    }

    const newApplication = {
      id: Date.now(),
      jobId,
      job,
      appliedDate: new Date().toISOString(),
      status: 'Applied',
      timeline: [
        {
          status: 'Applied',
          date: new Date().toISOString(),
          description: 'Application submitted successfully',
        },
      ],
    }

    const updated = [...applications, newApplication]
    setApplications(updated)
    localStorage.setItem('applications', JSON.stringify(updated))
    toast.success('Application submitted successfully!')
  }

  const updateApplicationStatus = (applicationId, newStatus, description) => {
    const updated = applications.map((app) => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
          timeline: [
            ...app.timeline,
            {
              status: newStatus,
              date: new Date().toISOString(),
              description: description || `Status updated to ${newStatus}`,
            },
          ],
        }
      }
      return app
    })

    setApplications(updated)
    localStorage.setItem('applications', JSON.stringify(updated))
    toast.success(`Application status updated to ${newStatus}`)
  }

  const uploadResume = (resumeData) => {
    setUserResume(resumeData)
    localStorage.setItem('userResume', JSON.stringify(resumeData))
    toast.success('Resume uploaded successfully')
  }

  const value = {
    jobs,
    filteredJobs,
    savedJobs,
    applications,
    userResume,
    filters,
    updateFilters,
    resetFilters,
    saveJob,
    applyToJob,
    updateApplicationStatus,
    uploadResume,
  }

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}

export default JobContext
