import { useState } from 'react'
import { motion } from 'framer-motion'
import { useJobs } from '../context/JobContext'
import { Upload, FileText, CheckCircle, X } from 'lucide-react'
import { fadeIn } from '../utils/motion'
import toast from 'react-hot-toast'

const ResumeUpload = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const { uploadResume, userResume } = useJobs()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file) => {
    if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Please upload a PDF or DOC file')
      return
    }

    setFileName(file.name)

    const mockResumeData = {
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      skills: [
        'JavaScript',
        'React',
        'Node.js',
        'TypeScript',
        'Python',
        'AWS',
        'Docker',
        'Git',
      ],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          duration: '2020-Present',
        },
        {
          title: 'Software Developer',
          company: 'StartupXYZ',
          duration: '2018-2020',
        },
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University Name',
          year: '2018',
        },
      ],
    }

    uploadResume(mockResumeData)
    toast.success('Resume uploaded successfully!')
  }

  const handleRemove = () => {
    setFileName('')
    uploadResume(null)
    toast.success('Resume removed')
  }

  if (userResume) {
    return (
      <motion.div variants={fadeIn} className="panel bg-gradient-to-br from-success/10 to-success/5 border-success/20">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Resume Uploaded
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {userResume.fileName}
              </p>
              <div className="flex flex-wrap gap-2">
                {userResume.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="badge badge-success">
                    {skill}
                  </span>
                ))}
                {userResume.skills.length > 5 && (
                  <span className="badge bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400">
                    +{userResume.skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-danger/10 text-danger rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div variants={fadeIn} className="panel">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Upload Your Resume
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get AI-powered job recommendations based on your skills and experience
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-gray-300 dark:border-dark-border hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {isDragging ? (
              <Upload className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <FileText className="w-8 h-8 text-primary" />
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supports PDF, DOC, DOCX
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ResumeUpload
