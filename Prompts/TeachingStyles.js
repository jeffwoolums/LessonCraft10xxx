/**
 * LessonCraft Teaching Styles
 * 
 * Three distinct lesson formats optimized for different teaching contexts
 */

const TEACHING_STYLES = {
  groupDiscussion: {
    name: "Group Discussion",
    description: "Interactive, question-driven format for engaged classroom learning",
    icon: "person.3.fill",
    slideStructure: {
      introduction: {
        focus: "Hook question to spark discussion",
        includeIcebreaker: true,
        wordCount: 200
      },
      mainContent: {
        questionRatio: 0.6, // 60% questions, 40% content
        includeBreakoutPrompts: true,
        includePairShare: true,
        facilitationTips: true
      },
      closeout: {
        includeGroupTestimony: true,
        includeCommitmentPrompt: true
      }
    }
  },
  
  teamBased: {
    name: "Team-Based",
    description: "Competitive, activity-driven format for youth and energetic classes",
    icon: "flag.2.crossed.fill",
    slideStructure: {
      introduction: {
        focus: "Team formation and challenge preview",
        includeTeamSetup: true,
        wordCount: 150
      },
      mainContent: {
        questionRatio: 0.3,
        includeScriptureChase: true,
        includeQuizSegments: true,
        includeTeamChallenges: true,
        pointSystem: true
      },
      closeout: {
        includeWinnerRecognition: true,
        includeTeamReflection: true
      }
    }
  },
  
  lecture: {
    name: "Lecture / Pulpit",
    description: "Traditional talk format for sacrament meeting or formal instruction",
    icon: "mic.fill",
    slideStructure: {
      introduction: {
        focus: "Compelling story or hook",
        includePersonalExperience: true,
        wordCount: 400
      },
      mainContent: {
        questionRatio: 0.1, // Rhetorical questions only
        narrativeFlow: true,
        smoothTransitions: true,
        testimonyMoments: true
      },
      closeout: {
        includeFormalTestimony: true,
        includeCallToAction: true
      }
    }
  }
};

function buildTeachingStylePrompt(style, baseRequest) {
  const styleConfig = TEACHING_STYLES[style] || TEACHING_STYLES.groupDiscussion;
  
  const styleInstructions = {
    groupDiscussion: `
TEACHING STYLE: GROUP DISCUSSION
================================
This lesson is designed for interactive classroom discussion.

FORMAT REQUIREMENTS:
- Start with a thought-provoking HOOK QUESTION (not a statement)
- Include an ICEBREAKER activity in the introduction (2-3 minutes)
- Each content slide must have:
  * 5-7 discussion questions (open-ended, not yes/no)
  * "Turn to your neighbor" prompts
  * Breakout group activities (3-5 minutes each)
  * Facilitation tips for the teacher (how to guide discussion)
- Include "What do you think?" moments throughout
- Questions should build on each other
- Include "dig deeper" follow-up questions
- Closeout should invite class members to share testimonies
- End with a personal commitment prompt

TONE: Warm, inviting, curious. Use "we" and "us" language.
PACING: Allow 2-3 minutes per discussion question.
`,

    teamBased: `
TEACHING STYLE: TEAM-BASED / COMPETITIVE
========================================
This lesson uses friendly competition to drive engagement.

FORMAT REQUIREMENTS:
- Introduction must explain team formation (2-4 teams)
- Include a POINT SYSTEM (suggest point values for activities)
- Each content slide must have:
  * Scripture Chase challenge (first team to find verse wins points)
  * Quick Quiz questions (multiple choice or short answer)
  * Team challenges ("Your team has 3 minutes to find 3 examples of...")
  * Bonus point opportunities
- Include a SCOREBOARD tracking section
- Mix individual and team activities
- Include "lightning round" rapid-fire questions
- Closeout includes winner recognition AND spiritual reflection
- End with teams sharing what they learned

TONE: Energetic, fun, encouraging. Build excitement!
PACING: Fast-paced, 5-7 minute activity blocks.
AUDIENCE: Great for youth, young adults, or energetic adult classes.
`,

    lecture: `
TEACHING STYLE: LECTURE / PULPIT TALK
=====================================
This is a traditional talk format for sacrament meeting or formal instruction.

FORMAT REQUIREMENTS:
- Introduction must be a compelling STORY (true, from church sources)
- Use smooth, flowing narrative transitions between points
- Questions should be RHETORICAL (don't pause for answers)
- Each content section must have:
  * Clear topic sentence
  * Supporting scriptures woven into narrative
  * Relevant quotes from prophets/apostles
  * Personal experiences or historical examples
  * Testimony moment
- Build toward a spiritual climax
- Use repetition of key phrases for emphasis
- Closeout must include formal testimony bearing
- End with clear call to action

TONE: Reverent, inspiring, testimony-driven. First person "I" voice.
PACING: Measured, allow moments for Spirit.
TIMING: Designed for ${baseRequest.duration_minutes || 15} minute talk.
`
  };

  return styleInstructions[style] || styleInstructions.groupDiscussion;
}

function getSlideStructure(style) {
  const styleConfig = TEACHING_STYLES[style] || TEACHING_STYLES.groupDiscussion;
  
  if (style === 'groupDiscussion') {
    return {
      introduction: {
        type: "introduction",
        title: "",
        hookQuestion: "",
        icebreaker: {
          activity: "",
          duration: "2-3 minutes",
          instructions: ""
        },
        introductionText: "",
        parablesOrTopicsCovered: []
      },
      content: {
        type: "discussion",
        title: "",
        mainConcept: "",
        scriptures: [],
        quotes: [],
        discussionQuestions: [
          { question: "", followUp: "", facilitationTip: "" }
        ],
        pairSharePrompt: "",
        breakoutActivity: {
          instructions: "",
          duration: "",
          debrief: ""
        },
        artwork: [],
        hymns: []
      },
      closeout: {
        type: "closeout",
        title: "",
        summary: "",
        testimonyInvitation: "",
        commitmentPrompt: "",
        closingQuestion: ""
      }
    };
  }
  
  if (style === 'teamBased') {
    return {
      introduction: {
        type: "introduction",
        title: "",
        teamSetup: {
          numberOfTeams: 2,
          formationMethod: "",
          teamNames: []
        },
        pointSystemExplanation: "",
        challengePreview: "",
        introductionText: ""
      },
      content: {
        type: "challenge",
        title: "",
        mainConcept: "",
        scriptures: [],
        scriptureChase: {
          clue: "",
          answer: "",
          points: 100
        },
        quizQuestions: [
          { question: "", options: [], correctAnswer: "", points: 50 }
        ],
        teamChallenge: {
          instructions: "",
          duration: "",
          points: 200,
          judgingCriteria: ""
        },
        bonusOpportunity: "",
        artwork: [],
        hymns: []
      },
      closeout: {
        type: "closeout",
        title: "",
        finalScoreTally: "",
        winnerRecognition: "",
        spiritualReflection: "",
        teamShareOut: ""
      }
    };
  }
  
  if (style === 'lecture') {
    return {
      introduction: {
        type: "introduction",
        title: "",
        openingStory: {
          narrative: "",
          source: "",
          transitionToTopic: ""
        },
        thesisStatement: "",
        previewOfPoints: []
      },
      content: {
        type: "point",
        title: "",
        topicSentence: "",
        narrative: "",
        scriptures: [],
        quotes: [],
        personalExperience: "",
        rhetoricalQuestion: "",
        testimonyMoment: "",
        transitionToNext: "",
        artwork: [],
        hymns: []
      },
      closeout: {
        type: "closeout",
        title: "",
        summaryOfPoints: [],
        climaxMoment: "",
        formalTestimony: "",
        callToAction: "",
        closingScripture: {}
      }
    };
  }
  
  return TEACHING_STYLES.groupDiscussion.slideStructure;
}

module.exports = {
  TEACHING_STYLES,
  buildTeachingStylePrompt,
  getSlideStructure
};
