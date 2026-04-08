interface Course {
  id: string;
  title: string;
  description: string;
  modules: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface Enrollment {
  courseId: string;
  userId: string;
  enrolledAt: string;
  progress: number;
}

interface Quiz {
  id: string;
  courseId: string;
  questions: QuizQuestion[];
  passingScore: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const COURSES: Course[] = [
  {
    id: "fleet-101",
    title: "Fleet Architecture Fundamentals",
    description: "Learn the core concepts of fleet-based systems",
    modules: 5,
    duration: "4 hours",
    level: "beginner"
  },
  {
    id: "worker-mastery",
    title: "Cloudflare Workers Deep Dive",
    description: "Master serverless execution at the edge",
    modules: 8,
    duration: "6 hours",
    level: "intermediate"
  },
  {
    id: "global-distribution",
    title: "Global Fleet Distribution",
    description: "Design globally distributed applications",
    modules: 7,
    duration: "5 hours",
    level: "advanced"
  }
];

const ENROLLMENTS = new Map<string, Enrollment>();
const QUIZZES = new Map<string, Quiz>();

const HTML_TEMPLATE = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'">
    <title>Fleet University</title>
    <style>
        :root {
            --dark-bg: #0a0a0f;
            --accent: #0ea5e9;
            --text-light: #f8fafc;
            --text-muted: #94a3b8;
            --card-bg: #1e293b;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--dark-bg);
            color: var(--text-light);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: linear-gradient(135deg, #0a0a0f 0%, #1e1b4b 100%);
            padding: 2rem 0;
            border-bottom: 2px solid var(--accent);
        }
        
        .hero {
            text-align: center;
            padding: 4rem 0;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            background: linear-gradient(90deg, var(--accent), #60a5fa);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .feature-card {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid #334155;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent);
        }
        
        .feature-card h3 {
            color: var(--accent);
            margin-bottom: 1rem;
        }
        
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .course-card {
            background: var(--card-bg);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #334155;
        }
        
        .course-header {
            padding: 1.5rem;
            background: rgba(14, 165, 233, 0.1);
            border-bottom: 1px solid #334155;
        }
        
        .course-body {
            padding: 1.5rem;
        }
        
        .level-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 0.5rem;
        }
        
        .beginner { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
        .intermediate { background: rgba(234, 179, 8, 0.2); color: #fbbf24; }
        .advanced { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        
        .footer {
            margin-top: 4rem;
            padding: 2rem 0;
            border-top: 1px solid #334155;
            text-align: center;
            color: var(--text-muted);
        }
        
        .api-section {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 12px;
            margin: 3rem 0;
        }
        
        .endpoint {
            background: rgba(30, 41, 59, 0.5);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            border-left: 4px solid var(--accent);
        }
        
        .endpoint-method {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: var(--accent);
            color: white;
            border-radius: 4px;
            font-weight: 600;
            margin-right: 1rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="hero">
                <h1>Fleet University</h1>
                <p>Learn about fleet architecture through interactive courses, hands-on labs, and expert-led training</p>
            </div>
        </div>
    </header>
    
    <main class="container">
        ${content}
        
        <div class="api-section">
            <h2>API Endpoints</h2>
            <div class="endpoint">
                <span class="endpoint-method">GET</span>
                <code>/api/courses</code>
                <p>Retrieve all available courses</p>
            </div>
            <div class="endpoint">
                <span class="endpoint-method">GET</span>
                <code>/api/enroll?courseId=:id&userId=:id</code>
                <p>Enroll in a course</p>
            </div>
            <div class="endpoint">
                <span class="endpoint-method">POST</span>
                <code>/api/quiz</code>
                <p>Submit quiz answers</p>
            </div>
            <div class="endpoint">
                <span class="endpoint-method">GET</span>
                <code>/health</code>
                <p>Health check endpoint</p>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <div class="fleet-footer">
                <p>© 2024 Fleet University. Master fleet architecture with interactive learning.</p>
            </div>
        </div>
    </footer>
</body>
</html>
`;

const HOME_CONTENT = `
<section class="features">
    <div class="feature-card">
        <h3>Interactive Courses</h3>
        <p>Engage with hands-on lessons and real-world fleet architecture scenarios</p>
    </div>
    <div class="feature-card">
        <h3>Quizzes & Certifications</h3>
        <p>Test your knowledge and earn certifications to validate your expertise</p>
    </div>
    <div class="feature-card">
        <h3>Learning Paths</h3>
        <p>Structured curriculum from beginner to advanced fleet concepts</p>
    </div>
    <div class="feature-card">
        <h3>Hands-on Labs</h3>
        <p>Practice in real environments with guided fleet deployment exercises</p>
    </div>
</section>

<section>
    <h2>Featured Courses</h2>
    <div class="courses-grid">
        ${COURSES.map(course => `
            <div class="course-card">
                <div class="course-header">
                    <h3>${course.title}</h3>
                    <span class="level-badge ${course.level}">${course.level.toUpperCase()}</span>
                </div>
                <div class="course-body">
                    <p>${course.description}</p>
                    <div style="margin-top: 1rem; color: var(--text-muted); font-size: 0.875rem;">
                        <span>${course.modules} modules</span>
                        <span style="margin-left: 1rem;">${course.duration}</span>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
</section>
`;

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Set security headers
  const headers = new Headers({
    "Content-Type": "text/html; charset=UTF-8",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
  });

  // Health check endpoint
  if (path === "/health") {
    return new Response(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // API endpoints
  if (path.startsWith("/api")) {
    return handleAPI(request, url);
  }

  // Home page
  if (path === "/") {
    return new Response(HTML_TEMPLATE(HOME_CONTENT), { headers });
  }

  // 404 for other routes
  return new Response(HTML_TEMPLATE("<h2>Page Not Found</h2><p>The requested resource could not be found.</p>"), {
    status: 404,
    headers
  });
}

async function handleAPI(request: Request, url: URL): Promise<Response> {
  const path = url.pathname;
  const method = request.method;
  const headers = { "Content-Type": "application/json" };

  try {
    // GET /api/courses
    if (path === "/api/courses" && method === "GET") {
      const response: APIResponse = {
        success: true,
        data: COURSES
      };
      return new Response(JSON.stringify(response), { headers });
    }

    // GET /api/enroll
    if (path === "/api/enroll" && method === "GET") {
      const courseId = url.searchParams.get("courseId");
      const userId = url.searchParams.get("userId");

      if (!courseId || !userId) {
        const response: APIResponse = {
          success: false,
          error: "Missing courseId or userId parameters"
        };
        return new Response(JSON.stringify(response), { status: 400, headers });
      }

      const course = COURSES.find(c => c.id === courseId);
      if (!course) {
        const response: APIResponse = {
          success: false,
          error: "Course not found"
        };
        return new Response(JSON.stringify(response), { status: 404, headers });
      }

      const enrollmentKey = `${userId}-${courseId}`;
      const enrollment: Enrollment = {
        courseId,
        userId,
        enrolledAt: new Date().toISOString(),
        progress: 0
      };

      ENROLLMENTS.set(enrollmentKey, enrollment);

      const response: APIResponse = {
        success: true,
        data: {
          enrollment,
          message: `Successfully enrolled in ${course.title}`
        }
      };
      return new Response(JSON.stringify(response), { headers });
    }

    // POST /api/quiz
    if (path === "/api/quiz" && method === "POST") {
      const body = await request.json() as { quizId: string; answers: number[] };
      
      if (!body.quizId || !body.answers) {
        const response: APIResponse = {
          success: false,
          error: "Missing quizId or answers in request body"
        };
        return new Response(JSON.stringify(response), { status: 400, headers });
      }

      const quiz = QUIZZES.get(body.quizId);
      if (!quiz) {
        const response: APIResponse = {
          success: false,
          error: "Quiz not found"
        };
        return new Response(JSON.stringify(response), { status: 404, headers });
      }

      let score = 0;
      body.answers.forEach((answer, index) => {
        if (quiz.questions[index] && answer === quiz.questions[index].correctAnswer) {
          score++;
        }
      });

      const percentage = (score / quiz.questions.length) * 100;
      const passed = percentage >= quiz.passingScore;

      const response: APIResponse = {
        success: true,
        data: {
          score,
          total: quiz.questions.length,
          percentage: percentage.toFixed(1),
          passed,
          message: passed ? "Quiz passed! Congratulations!" : "Quiz not passed. Try again!"
        }
      };
      return new Response(JSON.stringify(response), { headers });
    }

    // API 404
    const response: APIResponse = {
      success: false,
      error: "API endpoint not found"
    };
    return new Response(JSON.stringify(response), { status: 404, headers });

  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error"
    };
    return new Response(JSON.stringify(response), { status: 500, headers });
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  }
};
