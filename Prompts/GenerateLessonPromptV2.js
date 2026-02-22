/**
 * LessonCraft v2.0 - Enhanced Lesson Generation with Teaching Styles
 */

const { TEACHING_STYLES, buildTeachingStylePrompt, getSlideStructure } = require('./TeachingStyles');

function buildLessonPromptV2(request) {
  const {
    topic = "Default Topic",
    audience = "Adult Sunday School",
    tone = "Inspirational",
    duration_minutes = 45,
    teachingStyle = "groupDiscussion", // NEW: groupDiscussion | teamBased | lecture
    lessonSource = "FreeTopic",
    comeFollowMeURL = null,
    conferenceTalkURL = null,
    content_sources = [],
    settings = {
      maxParableSlides: 3,
      maxPointsPerSlide: 5,
      maxScripturesPerSlide: 2,
      maxQuotesPerSlide: 2,
      maxArtworksPerSlide: 1,
      maxHymnsPerSlide: 1,
      maxQuestionsPerSlide: 5
    }
  } = request || {};

  // Get teaching style configuration
  const styleConfig = TEACHING_STYLES[teachingStyle] || TEACHING_STYLES.groupDiscussion;
  const styleInstructions = buildTeachingStylePrompt(teachingStyle, request);
  const slideStructure = getSlideStructure(teachingStyle);

  // Build content sources string
  const specificSources = content_sources.map(source => {
    switch (source) {
      case "ComeFollowMe": return "Come Follow Me manuals";
      case "ConferenceTalks": return "General Conference talks";
      case "Liahona": return "Liahona magazine";
      case "Friend": return "Friend magazine";
      case "ForStrengthOfYouth": return "For the Strength of Youth";
      case "PreachMyGospel": return "Preach My Gospel manual";
      case "ChurchHistory": return "Church History and Saints volumes";
      case "JesusTheChrist": return "Jesus the Christ by James E. Talmage";
      case "GospelTopics": return "Gospel Topics Essays";
      case "Hymns": return "The 1985 Hymns";
      case "Scriptures": return "Standard Works (Bible, Book of Mormon, D&C, Pearl of Great Price)";
      default: return source;
    }
  });

  let sourceConstraint = specificSources.length > 0 
    ? `Use content from: ${specificSources.join(", ")}. Link to ChurchofJesusChrist.org when possible.`
    : `Use LDS scriptures and teachings. Link to ChurchofJesusChrist.org when possible.`;

  if (lessonSource === "ComeFollowMe" && comeFollowMeURL) {
    sourceConstraint += `\nAlign with this Come Follow Me lesson: ${comeFollowMeURL}`;
  }
  if (lessonSource === "ConferenceTalk" && conferenceTalkURL) {
    sourceConstraint += `\nBase the lesson on this talk: ${conferenceTalkURL}`;
  }

  // Build the full prompt
  return `
You are LessonCraft AI v2.0, an expert LDS lesson and talk generator.

=== LESSON PARAMETERS ===
Title: "${topic}"
Audience: ${audience}
Duration: ${duration_minutes} minutes
Teaching Style: ${styleConfig.name}
${sourceConstraint}

${styleInstructions}

=== OUTPUT REQUIREMENTS ===
- Output ONLY valid JSON (no markdown, no explanations)
- All scripture references must include book, chapter:verse format
- All links should point to churchofjesuschrist.org when applicable
- Include hymn numbers from the 1985 hymnal
- Artwork URLs should reference church media library when possible

=== JSON STRUCTURE FOR ${styleConfig.name.toUpperCase()} ===

${JSON.stringify({
  meta: {
    title: topic,
    teachingStyle: teachingStyle,
    audience: audience,
    duration: duration_minutes,
    generatedAt: "ISO timestamp"
  },
  settings: settings,
  slides: [
    slideStructure.introduction,
    slideStructure.content,
    slideStructure.content, // Multiple content slides
    slideStructure.closeout,
    {
      type: "teacherInstructions",
      title: "Preparation Guide",
      materialsNeeded: [],
      roomSetup: "",
      preparationAdvice: [],
      timingGuide: {},
      adaptationTips: []
    }
  ]
}, null, 2)}

Generate a complete, engaging ${styleConfig.name} lesson now.
`.trim();
}

// Quick generator functions for each style
function generateGroupDiscussionLesson(topic, options = {}) {
  return buildLessonPromptV2({
    ...options,
    topic,
    teachingStyle: 'groupDiscussion'
  });
}

function generateTeamBasedLesson(topic, options = {}) {
  return buildLessonPromptV2({
    ...options,
    topic,
    teachingStyle: 'teamBased'
  });
}

function generateLectureLesson(topic, options = {}) {
  return buildLessonPromptV2({
    ...options,
    topic,
    teachingStyle: 'lecture'
  });
}

module.exports = {
  buildLessonPromptV2,
  generateGroupDiscussionLesson,
  generateTeamBasedLesson,
  generateLectureLesson
};
