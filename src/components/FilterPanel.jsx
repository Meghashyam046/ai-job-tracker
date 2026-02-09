import { useState } from 'react'
import { motion } from 'framer-motion'
import { useJobs } from '../context/JobContext'
import { X, Filter, RotateCcw } from 'lucide-react'
import { fadeIn } from '../utils/motion'

const FilterPanel = () => {
  const { filters, updateFilters, resetFilters } = useJobs()
  const [skillInput, setSkillInput] = useState('')

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']
  const workModes = ['Remote', 'Hybrid', 'On-site']
  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ]

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      updateFilters({
        skills: [...filters.skills, skillInput.trim()],
      })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill) => {
    updateFilters({
      skills: filters.skills.filter((s) => s !== skill),
    })
  }

  return (
    <motion.div
      variants={fadeIn}
      className="panel sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Role
          </label>
          <input
            type="text"
            value={filters.role}
            onChange={(e) => updateFilters({ role: e.target.value })}
            placeholder="e.g., Software Engineer"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Skills
          </label>
          <form onSubmit={handleAddSkill} className="mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add skill and press Enter"
              className="input-field"
            />
          </form>
          <div className="flex flex-wrap gap-2">
            {filters.skills.map((skill) => (
              <span
                key={skill}
                className="badge badge-primary flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-danger transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
            placeholder="e.g., San Francisco"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Job Type
          </label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="jobType"
                  value={type}
                  checked={filters.jobType === type}
                  onChange={(e) => updateFilters({ jobType: e.target.value })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  {type}
                </span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="jobType"
                value=""
                checked={filters.jobType === ''}
                onChange={() => updateFilters({ jobType: '' })}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                All Types
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Work Mode
          </label>
          <div className="space-y-2">
            {workModes.map((mode) => (
              <label
                key={mode}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="workMode"
                  value={mode}
                  checked={filters.workMode === mode}
                  onChange={(e) => updateFilters({ workMode: e.target.value })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  {mode}
                </span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="workMode"
                value=""
                checked={filters.workMode === ''}
                onChange={() => updateFilters({ workMode: '' })}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                All Modes
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Match Score: {filters.minMatchScore}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minMatchScore}
            onChange={(e) => updateFilters({ minMatchScore: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Date Posted
          </label>
          <div className="space-y-2">
            {dateOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="datePosted"
                  value={option.value}
                  checked={filters.datePosted === option.value}
                  onChange={(e) => updateFilters({ datePosted: e.target.value })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FilterPanel
