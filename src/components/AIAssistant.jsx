import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJobs } from '../context/JobContext'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi! I'm your AI job search assistant. Ask me to find jobs or adjust your filters. Try saying 'Find remote software engineer jobs' or 'Show me jobs in San Francisco'.",
    },
  ])
  const [input, setInput] = useState('')
  const { updateFilters, resetFilters } = useJobs()

  const processQuery = (query) => {
    const lowerQuery = query.toLowerCase()
    let updates = {}

    if (lowerQuery.includes('remote')) {
      updates.workMode = 'Remote'
    } else if (lowerQuery.includes('hybrid')) {
      updates.workMode = 'Hybrid'
    } else if (lowerQuery.includes('on-site') || lowerQuery.includes('onsite')) {
      updates.workMode = 'On-site'
    }

    if (lowerQuery.includes('full-time') || lowerQuery.includes('full time')) {
      updates.jobType = 'Full-time'
    } else if (lowerQuery.includes('part-time') || lowerQuery.includes('part time')) {
      updates.jobType = 'Part-time'
    } else if (lowerQuery.includes('contract')) {
      updates.jobType = 'Contract'
    } else if (lowerQuery.includes('internship')) {
      updates.jobType = 'Internship'
    }

    const roleKeywords = [
      'engineer',
      'developer',
      'designer',
      'manager',
      'analyst',
      'scientist',
      'architect',
      'consultant',
    ]
    const foundRole = roleKeywords.find((role) => lowerQuery.includes(role))
    if (foundRole) {
      updates.role = foundRole.charAt(0).toUpperCase() + foundRole.slice(1)
    }

    const skillKeywords = [
      'react',
      'javascript',
      'python',
      'java',
      'typescript',
      'node',
      'aws',
      'docker',
      'kubernetes',
    ]
    const foundSkills = skillKeywords.filter((skill) => lowerQuery.includes(skill))
    if (foundSkills.length > 0) {
      updates.skills = foundSkills.map(
        (skill) => skill.charAt(0).toUpperCase() + skill.slice(1)
      )
    }

    const locationMatch = lowerQuery.match(
      /in ([a-z\s]+?)(?:\s|$|,|\.)/i
    )
    if (locationMatch) {
      updates.location = locationMatch[1]
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    if (lowerQuery.includes('reset') || lowerQuery.includes('clear')) {
      resetFilters()
      return "I've reset all filters for you. You can now see all available jobs."
    }

    if (Object.keys(updates).length > 0) {
      updateFilters(updates)
      const filterDescriptions = []
      if (updates.workMode) filterDescriptions.push(`${updates.workMode} positions`)
      if (updates.jobType) filterDescriptions.push(updates.jobType)
      if (updates.role) filterDescriptions.push(`${updates.role} roles`)
      if (updates.skills) filterDescriptions.push(`requiring ${updates.skills.join(', ')}`)
      if (updates.location) filterDescriptions.push(`in ${updates.location}`)

      return `Great! I've filtered jobs to show ${filterDescriptions.join(', ')}. Check out the results!`
    }

    return "I understand you're looking for jobs. Try being more specific, like 'Find remote React developer jobs in New York' or 'Show me full-time positions'."
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const response = processQuery(input)
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response,
      }
      setMessages((prev) => [...prev, aiMessage])
      toast.success('Filters updated!')
    }, 500)

    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
          >
            <div className="glass-card shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      AI Assistant
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-primary to-primary-dark text-white'
                          : 'bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-dark-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me to find jobs..."
                    className="input-field flex-1"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    className="btn-primary px-4"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="floating-button"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>
    </>
  )
}

export default AIAssistant
