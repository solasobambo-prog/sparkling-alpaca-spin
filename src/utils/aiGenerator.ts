"use client";

export interface GeneratedLesson {
  title: string;
  definition: string;
  utility: string;
  practicalApplication: string;
  tools: { name: string; description: string }[];
  benefits: { title: string; description: string }[];
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

// Helper to parse uploaded syllabus files (TXT, Markdown, JSON, CSV)
export const parseSyllabus = (fileContent: string, fileName: string): { id: string; title: string; status: 'locked' | 'current' | 'completed' }[] => {
  const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const topics: string[] = [];

  // Try parsing as JSON first
  try {
    const parsed = JSON.parse(fileContent);
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        id: String(index + 1),
        title: typeof item === 'string' ? item : (item.title || item.name || `Module ${index + 1}`),
        status: index === 0 ? 'current' : 'locked'
      }));
    } else if (parsed.modules || parsed.lessons || parsed.topics) {
      const list = parsed.modules || parsed.lessons || parsed.topics;
      if (Array.isArray(list)) {
        return list.map((item, index) => ({
          id: String(index + 1),
          title: typeof item === 'string' ? item : (item.title || item.name || `Module ${index + 1}`),
          status: index === 0 ? 'current' : 'locked'
        }));
      }
    }
  } catch (e) {
    // Not JSON, proceed to line-by-line parsing
  }

  // Parse line-by-line (Markdown headers, numbered lists, or plain text)
  lines.forEach(line => {
    // Match Markdown headers (e.g., "# Topic", "## Topic") or numbered lists (e.g., "1. Topic")
    const cleanLine = line
      .replace(/^#+\s+/, '') // Remove markdown headers
      .replace(/^\d+[\.\)]\s+/, '') // Remove numbered lists
      .replace(/^-\s+/, '') // Remove bullet points
      .trim();

    if (cleanLine.length > 3 && cleanLine.length < 100 && !cleanLine.toLowerCase().startsWith('syllabus') && !cleanLine.toLowerCase().startsWith('curriculum')) {
      topics.push(cleanLine);
    }
  });

  // Fallback if no topics extracted
  if (topics.length === 0) {
    topics.push(
      "Introduction to Data Foundations",
      "Data Exploration & Variable Mapping",
      "Statistical Analysis & Hypothesis Testing",
      "Predictive Modeling & Insights",
      "Data Storytelling & Reporting"
    );
  }

  // Limit to top 8 modules for a clean learning path
  return topics.slice(0, 8).map((topic, index) => ({
    id: String(index + 1),
    title: topic,
    status: index === 0 ? 'current' : 'locked'
  }));
};

// Generates rich, customized lesson content based on the topic and dataset columns
export const generateLessonContent = (
  topicTitle: string,
  datasetName: string,
  columns: string[],
  sampleData: any[]
): GeneratedLesson => {
  const primaryCol = columns[0] || "Index";
  const secondaryCol = columns[1] || (columns[0] ? columns[0] : "Value");
  const numericCols = columns.filter(col => {
    if (!sampleData || sampleData.length === 0) return false;
    const val = sampleData[0][col];
    return !isNaN(Number(val)) && val !== '';
  });
  const targetNumeric = numericCols[0] || secondaryCol;

  return {
    title: topicTitle,
    definition: `In the context of "${topicTitle}", we focus on establishing a systematic framework to interpret, clean, and extract value from raw information. This involves understanding the underlying distribution, identifying key dimensions, and preparing the data for advanced analytical modeling.`,
    utility: `This module equips you with the analytical mindset required to dissect complex datasets. By mastering "${topicTitle}", you learn how to formulate hypotheses, detect anomalies, and map relationships between variables to drive strategic decision-making.`,
    practicalApplication: `Let's apply this directly to your uploaded dataset, "${datasetName}". 
    With ${columns.length} columns detected, we can perform targeted analysis. For instance, we can examine the distribution of "${primaryCol}" and see how it correlates with "${targetNumeric}". 
    By running exploratory queries on columns like [${columns.slice(0, 4).join(', ')}], we can uncover hidden patterns, detect outliers, and build predictive models tailored specifically to this data structure.`,
    tools: [
      {
        name: "Pandas & NumPy (Python)",
        description: "The industry standard libraries for manipulating structured data, handling missing values, and performing vectorized operations."
      },
      {
        name: "SQL (Structured Query Language)",
        description: "Essential for querying, filtering, and aggregating data directly from relational databases."
      },
      {
        name: "Seaborn & Matplotlib",
        description: "Powerful visualization libraries used to plot distributions, correlation matrices, and trend lines."
      }
    ],
    benefits: [
      {
        title: "Data-Driven Confidence",
        description: `By analyzing columns like "${primaryCol}", organizations can back up strategic decisions with empirical evidence rather than intuition.`
      },
      {
        title: "Proactive Problem Solving",
        description: `Identifying trends in "${targetNumeric}" allows businesses to anticipate market shifts, customer churn, or operational bottlenecks before they escalate.`
      },
      {
        title: "Resource Optimization",
        description: "Automating data pipelines and analysis workflows saves hundreds of hours of manual spreadsheet work."
      }
    ]
  };
};

// Generates dynamic quiz questions based on the topic and dataset columns
export const generateQuizQuestions = (topicTitle: string, columns: string[]): QuizQuestion[] => {
  const primaryCol = columns[0] || "primary variable";
  const secondaryCol = columns[1] || "secondary variable";

  return [
    {
      id: 1,
      text: `When applying the principles of "${topicTitle}" to your dataset, what is the primary goal of analyzing the "${primaryCol}" column?`,
      options: [
        "To delete the column to save storage space",
        "To understand its distribution, identify outliers, and establish baseline patterns",
        "To manually rewrite all values to match a pre-defined template",
        "To hide the column from stakeholders"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      text: `Which tool or library is best suited for performing the core operations discussed in "${topicTitle}"?`,
      options: [
        "A basic text editor like Notepad",
        "Python libraries like Pandas/NumPy or SQL databases",
        "A presentation tool like PowerPoint",
        "An email client"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      text: `How does mastering "${topicTitle}" directly benefit an organization analyzing columns like "${secondaryCol}"?`,
      options: [
        "It guarantees that no more data will ever need to be collected",
        "It enables predictive insights and data-driven decision making based on empirical trends",
        "It automatically translates the dataset into multiple languages",
        "It reduces the speed of the database servers"
      ],
      correctAnswer: 1
    }
  ];
};