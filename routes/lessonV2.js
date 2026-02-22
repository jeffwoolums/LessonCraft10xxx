/**
 * LessonCraft v2.0 API Routes
 * 
 * Enhanced lesson generation with teaching styles
 */

const express = require('express');
const router = express.Router();
const { buildLessonPromptV2 } = require('../Prompts/GenerateLessonPromptV2');
const { TEACHING_STYLES } = require('../Prompts/TeachingStyles');

// OpenAI configuration (import from your existing setup)
// const openaiService = require('../services/OpenAIService');

/**
 * GET /api/v2/styles
 * Returns available teaching styles
 */
router.get('/styles', (req, res) => {
  const styles = Object.entries(TEACHING_STYLES).map(([key, value]) => ({
    id: key,
    name: value.name,
    description: value.description,
    icon: value.icon
  }));
  
  res.json({
    success: true,
    styles
  });
});

/**
 * POST /api/v2/lesson
 * Generate a lesson with specified teaching style
 * 
 * Body:
 * {
 *   topic: "Faith in Jesus Christ",
 *   teachingStyle: "groupDiscussion" | "teamBased" | "lecture",
 *   audience: "Adult Sunday School",
 *   duration_minutes: 45,
 *   lessonSource: "FreeTopic" | "ComeFollowMe" | "ConferenceTalk",
 *   comeFollowMeURL: "optional URL",
 *   conferenceTalkURL: "optional URL",
 *   content_sources: ["Scriptures", "ConferenceTalks", ...]
 * }
 */
router.post('/lesson', async (req, res) => {
  try {
    const {
      topic,
      teachingStyle = 'groupDiscussion',
      audience = 'Adult Sunday School',
      duration_minutes = 45,
      lessonSource = 'FreeTopic',
      comeFollowMeURL,
      conferenceTalkURL,
      content_sources = ['Scriptures', 'ConferenceTalks']
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    if (!TEACHING_STYLES[teachingStyle]) {
      return res.status(400).json({
        success: false,
        error: `Invalid teaching style. Valid options: ${Object.keys(TEACHING_STYLES).join(', ')}`
      });
    }

    // Build the prompt
    const prompt = buildLessonPromptV2({
      topic,
      teachingStyle,
      audience,
      duration_minutes,
      lessonSource,
      comeFollowMeURL,
      conferenceTalkURL,
      content_sources
    });

    // Call OpenAI (uncomment and adjust for your setup)
    /*
    const completion = await openaiService.createCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are LessonCraft AI, an expert LDS lesson generator.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const lessonJSON = JSON.parse(completion.choices[0].message.content);
    */

    // For testing, return the prompt structure
    res.json({
      success: true,
      message: 'Lesson generation endpoint ready',
      request: {
        topic,
        teachingStyle,
        styleInfo: TEACHING_STYLES[teachingStyle],
        audience,
        duration_minutes
      },
      prompt_preview: prompt.substring(0, 500) + '...'
    });

  } catch (error) {
    console.error('Lesson generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/v2/lesson/quick/:style
 * Quick generation with style preset
 */
router.post('/lesson/quick/:style', async (req, res) => {
  const { style } = req.params;
  const { topic } = req.body;

  if (!TEACHING_STYLES[style]) {
    return res.status(400).json({
      success: false,
      error: `Invalid style: ${style}`
    });
  }

  // Forward to main endpoint with preset style
  req.body.teachingStyle = style;
  return router.handle(req, res);
});

module.exports = router;
