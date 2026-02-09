export const calculateMatchScore = (job, resume) => {
  if (!job || !resume) return 0

  let score = 0
  let maxScore = 100

  const resumeSkills = resume.skills.map(s => s.toLowerCase())
  const jobSkills = job.skills.map(s => s.toLowerCase())

  const matchingSkills = jobSkills.filter(skill => 
    resumeSkills.some(resumeSkill => 
      resumeSkill.includes(skill) || skill.includes(resumeSkill)
    )
  )

  const skillMatchPercentage = jobSkills.length > 0 
    ? (matchingSkills.length / jobSkills.length) * 60 
    : 0
  score += skillMatchPercentage

  const jobTitleWords = job.title.toLowerCase().split(' ')
  const resumeExperienceTitles = resume.experience
    .map(exp => exp.title.toLowerCase())
    .join(' ')

  const titleMatch = jobTitleWords.some(word => 
    resumeExperienceTitles.includes(word) && word.length > 3
  )
  if (titleMatch) {
    score += 20
  }

  const experienceYears = parseInt(resume.experience[0]?.duration?.match(/\d+/)?.[0] || 0)
  const requiredYears = parseInt(
    job.requirements.find(req => req.match(/\d+\+?\s*years?/i))?.match(/\d+/)?.[0] || 0
  )

  if (experienceYears >= requiredYears) {
    score += 15
  } else if (experienceYears >= requiredYears * 0.7) {
    score += 10
  } else {
    score += 5
  }

  if (resume.education && resume.education.length > 0) {
    const hasRelevantDegree = resume.education.some(edu => 
      edu.degree.toLowerCase().includes('computer') ||
      edu.degree.toLowerCase().includes('engineering') ||
      edu.degree.toLowerCase().includes('science')
    )
    if (hasRelevantDegree) {
      score += 5
    }
  }

  return Math.min(Math.round(score), maxScore)
}

export const getMatchCategory = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'fair'
  return 'low'
}

export const getMatchRecommendation = (score) => {
  if (score >= 90) {
    return 'Highly recommended! Your profile is an excellent match for this position.'
  }
  if (score >= 70) {
    return 'Good match! You meet most of the requirements for this role.'
  }
  if (score >= 50) {
    return 'Fair match. Consider applying if you are interested in developing these skills.'
  }
  return 'This position may require additional skills or experience.'
}
