export function validateTripInputs(req, res, next) {
  const {
    budget,
    groupSize,
    startDate,
    endDate,
    skillLevel,
    tripType,
    preferredRegion,
    departureLocation
  } = req.body

  const errors = []

  // Budget
  if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
    errors.push('Budget must be a positive number')
  }
  if (Number(budget) > 1000000) {
    errors.push('Budget exceeds maximum allowed value')
  }

  // Group size
  if (!groupSize || isNaN(Number(groupSize)) || Number(groupSize) < 1 || Number(groupSize) > 20) {
    errors.push('Group size must be between 1 and 20')
  }

  // Dates
  if (!startDate || !endDate) {
    errors.push('Start and end dates are required')
  } else {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 2)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      errors.push('Invalid date format')
    } else if (end <= start) {
      errors.push('End date must be after start date')
    } else {
      const tripDays = (end - start) / (1000 * 60 * 60 * 24)
      if (tripDays > 30) {
        errors.push('Trip duration cannot exceed 30 days')
      }
      if (start < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        errors.push('Start date cannot be in the past')
      }
      if (end > maxDate) {
        errors.push('Trip cannot be planned more than 2 years in advance')
      }
    }
  }

  // Skill level
  const validSkillLevels = ['beginner', 'intermediate', 'advanced', 'expert']
  if (!skillLevel || !validSkillLevels.includes(skillLevel)) {
    errors.push('Invalid skill level')
  }

  // Trip type
  const validTripTypes = ['resort', 'backcountry', 'hybrid']
  if (!tripType || !validTripTypes.includes(tripType)) {
    errors.push('Invalid trip type')
  }

  // Region
  if (!preferredRegion ||
    (Array.isArray(preferredRegion) && preferredRegion.length === 0) ||
    (!Array.isArray(preferredRegion) && !preferredRegion.trim())) {
    errors.push('At least one region must be selected')
  }

  // Departure location
  if (!departureLocation || typeof departureLocation !== 'string' || departureLocation.trim().length < 2) {
    errors.push('Departure location is required')
  }

  // Sanitize extras field to prevent prompt injection
  if (req.body.extras && typeof req.body.extras === 'string') {
    if (req.body.extras.length > 500) {
      errors.push('Extras field cannot exceed 500 characters')
    }
    // Strip any attempts to break out of the prompt
    req.body.extras = req.body.extras
      .replace(/\n\n/g, ' ')
      .replace(/Return ONLY|ignore previous|system prompt|CRITICAL|you are now/gi, '')
      .trim()
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors })
  }

  next()
}