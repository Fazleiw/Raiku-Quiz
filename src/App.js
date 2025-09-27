import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Play, RotateCcw, Share2, User } from 'lucide-react';

const RaikuQuizPlatform = () => {
  const [mode, setMode] = useState('home'); // 'home', 'learn', 'quiz', 'results'
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Learning content sections
  const learningContent = [
    {
      title: "What is Raiku?",
      content: [
        "Raiku brings enterprise-grade certainty to Solana infrastructure",
        "Empowers businesses to build and operate on-chain faster and more reliably",
        "Reengineers blockchain infrastructure from first principles",
        "Delivers deterministic execution and low-latency performance"
      ]
    },
    {
      title: "The Challenge",
      content: [
        "Applications on blockchains fail when it matters most",
        "Transactions don't land on time under stress",
        "Performance collapses under load",
        "Developers patch around infrastructure instead of relying on it"
      ]
    },
    {
      title: "Raiku's Solution",
      content: [
        "Creates a fair and efficient marketplace for blockspace",
        "Transforms blockspace from unpredictable commodity to guaranteed resource",
        "Uses same validators that secure Solana",
        "Offers guaranteed block inclusion and deterministic execution"
      ]
    },
    {
      title: "Key Features",
      content: [
        "Sub-30ms pre-confirmations",
        "Pre-book blockspace up to 60 seconds in advance",
        "Integrate with as little as two lines of code",
        "Seamless integration with Anza and Firedancer clients"
      ]
    },
    {
      title: "Ackermann Infrastructure",
      content: [
        "Raiku's technical solution for external systems",
        "Allows fast, scalable settlement on Solana",
        "Guarantees better inclusion and extends L1 features",
        "Private beta Q1 2025, mainnet Q3-Q4 2025"
      ]
    }
  ];

  // Question pool for randomized quiz
  const questionPool = [
    {
      question: "What does Raiku bring to Solana infrastructure?",
      options: ["Basic functionality", "Enterprise-grade certainty", "Simple tools", "Standard performance"],
      correct: 1,
      explanation: "Raiku brings enterprise-grade certainty to Solana infrastructure, empowering businesses to build and operate on-chain more reliably."
    },
    {
      question: "What is the main challenge Raiku addresses?",
      options: ["High fees", "Slow transactions", "Infrastructure reliability failures", "Complex coding"],
      correct: 2,
      explanation: "Raiku addresses the challenge where applications fail when it matters most due to unreliable infrastructure under stress."
    },
    {
      question: "How fast are Raiku's pre-confirmations?",
      options: ["Sub-30ms", "1 second", "5 seconds", "10 seconds"],
      correct: 0,
      explanation: "Raiku offers sub-30ms pre-confirmations, providing extremely low latency for transactions."
    },
    {
      question: "How far in advance can you pre-book blockspace with Raiku?",
      options: ["10 seconds", "30 seconds", "60 seconds", "5 minutes"],
      correct: 2,
      explanation: "Raiku allows you to pre-book blockspace up to 60 seconds in advance for guaranteed execution."
    },
    {
      question: "What is Ackermann?",
      options: ["A trading bot", "Raiku's technical infrastructure solution", "A wallet", "A DeFi protocol"],
      correct: 1,
      explanation: "Ackermann is Raiku's technical solution that allows external systems to settle on Solana with better inclusion and extended features."
    },
    {
      question: "When is the planned mainnet release for Ackermann?",
      options: ["Q1 2025", "Q2 2025", "Q3-Q4 2025", "2026"],
      correct: 2,
      explanation: "Ackermann mainnet release is planned for Q3-Q4 2025, following a private beta in Q1 2025."
    },
    {
      question: "How many lines of code are needed to integrate Raiku lite mode?",
      options: ["One line", "Two lines", "Five lines", "Ten lines"],
      correct: 1,
      explanation: "Builders can integrate Raiku lite mode with as little as two lines of code."
    },
    {
      question: "What does Raiku transform blockspace into?",
      options: ["A trading commodity", "A guaranteed, programmable resource", "A complex system", "An expensive service"],
      correct: 1,
      explanation: "Raiku transforms blockspace from an unpredictable commodity into a guaranteed, programmable resource."
    },
    {
      question: "Which clients does Raiku seamlessly integrate with?",
      options: ["Only custom clients", "Anza and Firedancer", "Ethereum clients", "Bitcoin clients"],
      correct: 1,
      explanation: "Raiku offers seamless integration with Anza (Agave) and Firedancer clients."
    },
    {
      question: "What can validators do with Raiku?",
      options: ["Only validate", "Scale revenue through plugins", "Reduce their work", "Stop validating"],
      correct: 1,
      explanation: "Raiku empowers validators to scale revenue through plugins while maintaining their validation role."
    }
  ];

  // Initialize quiz with random questions
  const initializeQuiz = () => {
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5); // 5 random questions
    setQuizQuestions(selectedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowAnswer(false);
  };

  // Fetch real Twitter profile picture via our API
  const fetchTwitterAvatar = async (username) => {
    try {
      // Remove @ if user includes it
      const cleanUsername = username.replace('@', '');
      
      // Call our backend API
      const response = await fetch(`/api/twitter-avatar?username=${cleanUsername}`);
      const data = await response.json();
      
      if (data.exists && data.avatar) {
        return data.avatar;
      } else {
        // Fallback to generated avatar if user not found
        return `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=22c55e,16a34a,15803d&textColor=ffffff`;
      }
    } catch (error) {
      console.error('Error fetching Twitter avatar:', error);
      // Fallback avatar
      return `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=22c55e,16a34a,15803d&textColor=ffffff`;
    }
  };

  const handleUsernameSubmit = async () => {
    if (username.trim()) {
      const avatar = await fetchTwitterAvatar(username);
      setUserAvatar(avatar);
      if (mode === 'quiz') {
        initializeQuiz();
      }
    }
  };

  const handleAnswer = (selectedIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedIndex;
    setAnswers(newAnswers);
    
    if (selectedIndex === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
    } else {
      setMode('results');
    }
  };

  const shareScore = () => {
    const text = `hey i just score ${score}/5 from @GriffinXBT Raiku website, come join in and hop on learning raiku easiest mode`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, '_blank');
  };

  // Home Screen
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Raiku Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Raiku Learning Platform
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Master enterprise-grade Solana infrastructure
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-lg border border-green-500/30 rounded-2xl p-8 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <User className="text-white" size={24} />
              <input
                type="text"
                placeholder="Enter your Twitter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-black/40 text-green-400 font-normal placeholder-gray-400 border border-green-500/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:text-green-300"
                onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
              />
              <button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>

          {username && userAvatar && (
            <div className="grid md:grid-cols-2 gap-8">
              <div 
                onClick={() => setMode('learn')}
                className="bg-black/60 backdrop-blur-lg border border-green-500/30 rounded-2xl p-8 cursor-pointer hover:bg-black/80 hover:border-green-400/50 transition-all group"
              >
                <div className="flex items-center mb-6">
                  <BookOpen className="text-green-400 group-hover:text-green-300" size={32} />
                  <h2 className="text-2xl font-bold text-white ml-4">Learn Mode</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  Explore Raiku's technology, features, and vision through interactive lessons.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">5 Sections • ~10 minutes</span>
                  <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-sm">
                    Start Learning
                  </div>
                </div>
              </div>

              <div 
                onClick={() => { setMode('quiz'); initializeQuiz(); }}
                className="bg-black/60 backdrop-blur-lg border border-green-500/30 rounded-2xl p-8 cursor-pointer hover:bg-black/80 hover:border-green-400/50 transition-all group"
              >
                <div className="flex items-center mb-6">
                  <Trophy className="text-green-400 group-hover:text-green-300" size={32} />
                  <h2 className="text-2xl font-bold text-white ml-4">Quiz Mode</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  Test your knowledge with randomized questions and earn a shareable score!
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">5 Random Questions • ~5 minutes</span>
                  <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-sm">
                    Take Quiz
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Learning Mode
  if (mode === 'learn') {
    const section = learningContent[currentSection];
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setMode('home')}
              className="text-white hover:text-green-400 transition-colors"
            >
              ← Back to Home
            </button>
            <div className="text-white">
              Section {currentSection + 1} of {learningContent.length}
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-lg border border-green-500/30 rounded-2xl p-8">
            <div className="flex items-center mb-8">
              <img src={userAvatar} alt={username} className="w-12 h-12 rounded-full mr-4" />
              <span className="text-white font-semibold">{username}</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-8">{section.title}</h1>
            
            <div className="space-y-6">
              {section.content.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0" />
                  <p className="text-lg text-gray-200 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-12">
              <button
                onClick={() => currentSection > 0 && setCurrentSection(currentSection - 1)}
                disabled={currentSection === 0}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-2">
                {learningContent.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentSection ? 'bg-green-400' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {currentSection < learningContent.length - 1 ? (
                <button
                  onClick={() => setCurrentSection(currentSection + 1)}
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => { setMode('quiz'); initializeQuiz(); }}
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors flex items-center"
                >
                  <Play className="mr-2" size={20} />
                  Take Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Mode
  if (mode === 'quiz') {
    if (quizQuestions.length === 0) return null;
    
    const question = quizQuestions[currentQuestion];
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setMode('home')}
              className="text-white hover:text-green-400 transition-colors"
            >
              ← Back to Home
            </button>
            <div className="text-white">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-lg border border-green-500/30 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img src={userAvatar} alt={username} className="w-12 h-12 rounded-full mr-4" />
                <span className="text-white font-semibold">{username}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{score}/{quizQuestions.length}</div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>
            
            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showAnswer && handleAnswer(index)}
                  disabled={showAnswer}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    showAnswer
                      ? index === question.correct
                        ? 'bg-green-500/30 border-2 border-green-400 text-white'
                        : answers[currentQuestion] === index
                        ? 'bg-red-500/30 border-2 border-red-400 text-white'
                        : 'bg-black/40 text-gray-300 border-2 border-gray-600'
                      : 'bg-black/40 hover:bg-black/60 text-white border-2 border-gray-600 hover:border-green-500/50'
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>

            {showAnswer && (
              <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 mb-8">
                <p className="text-white">{question.explanation}</p>
              </div>
            )}

            {showAnswer && (
              <div className="flex justify-center">
                <button
                  onClick={nextQuestion}
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results Mode
  if (mode === 'results') {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const getMessage = () => {
      if (percentage >= 80) return "🚀 Raiku Expert!";
      if (percentage >= 60) return "💪 Well Done!";
      if (percentage >= 40) return "📚 Keep Learning!";
      return "🔄 Try Again!";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/60 backdrop-blur-lg border border-green-500/30 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <img src={userAvatar} alt={username} className="w-24 h-24 rounded-full" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">{getMessage()}</h1>
            <h2 className="text-xl text-gray-300 mb-8">{username}</h2>
            
            <div className="bg-black/40 border border-green-500/50 rounded-xl p-8 mb-8">
              <div className="text-6xl font-bold text-green-400 mb-4">
                {score}/{quizQuestions.length}
              </div>
              <div className="text-2xl text-gray-300 mb-2">{percentage}% Correct</div>
              <div className="text-gray-400">on Raiku Knowledge Quiz</div>
              <div className="text-sm text-green-400 mt-2">@{username}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => { setMode('quiz'); initializeQuiz(); }}
                className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <RotateCcw className="mr-2" size={20} />
                Retake Quiz
              </button>
              
              <button
                onClick={shareScore}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <Share2 className="mr-2" size={20} />
                Share Score
              </button>
              
              <button
                onClick={() => setMode('home')}
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RaikuQuizPlatform;