import React, { useState, useRef, useEffect } from "react";
import { generateChatResponse } from "../api/openai";
import type { ChatMessage } from "../api/openai";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { PluggableList } from "unified";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaSpinner,
  FaTimes,
  FaComment,
} from "react-icons/fa";
import { getJobs } from "../api/jobs";

interface Job {
  id: number;
  title: string;
  location: string;
}

interface CodeProps {
  node?: React.ReactNode;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch and format job data
  const fetchJobData = async (): Promise<string> => {
    try {
      const jobs = await getJobs();
      return jobs
        .filter((job) => job.status === "active")
        .map(
          (job) =>
            `ID: ${job.id}, Title: ${job.title}, Location: ${job.location}`
        )
        .join("\n");
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return "";
    }
  };

  // Initialize chat with system message
  useEffect(() => {
    const initializeChat = async () => {
      const jobData = await fetchJobData();
      const systemMessage: ChatMessage = {
        role: "system",
        content: `You are a helpful assistant for Skyways Global, a leading recruitment agency. Your role is to provide accurate and helpful information about:

1. Company Culture:
- We are a dynamic, inclusive, and professional organization
- We value innovation, integrity, and excellence in service
- Our team is diverse and multicultural
- We maintain a collaborative and supportive work environment

2. Application Process:
- Candidates can apply through our website or job portals
- Applications are reviewed within 48-72 hours
- Shortlisted candidates are contacted for initial screening
- The process includes: application review → initial screening → technical assessment → final interview
- We provide feedback to all applicants

3. Job Opportunities:
Current available positions:
${jobData}

When recommending jobs:
- Use the job ID to create application links in the format: https://skyways-tuhe.vercel.app/jobs/{id}/apply
- Only recommend jobs that match the user's requirements
- Include the job title and location in your response
- Provide a direct application link for each recommended job
- If no exact matches are found, suggest similar positions or related opportunities
- For international opportunities, mention any visa or relocation support available

4. Agency Services:
- Recruitment and placement services
- Career counseling
- Resume optimization
- Interview preparation
- Visa and work permit assistance
- Relocation support

Always be professional, clear, and concise in your responses. If you're unsure about specific details, acknowledge the limitation and suggest contacting our support team at eddiemuhoro@gmail.com or calling +254 (0) 705 982 249.`,
      };
      setMessages([systemMessage]);
    };

    initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateChatResponse([...messages, userMessage]);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response || "Sorry, I could not process your request.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "Sorry, there was an error processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const markdownComponents: Components = {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4 text-blue-600">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-3 text-blue-500">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold mb-2 text-blue-400">{children}</h3>
    ),
    p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700">
        {children}
      </blockquote>
    ),
    code: ({
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement>) => {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <SyntaxHighlighter
          style={vscDarkPlus as any}
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-4"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className="bg-gray-100 rounded px-1.5 py-0.5 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {children}
      </td>
    ),
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="flex flex-col h-[500px] w-[350px] bg-white rounded-lg shadow-xl"
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaRobot className="text-lg" />
                AI Assistant
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages
                  .filter((msg) => msg.role !== "system")
                  .map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-800 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === "user" ? (
                            <FaUser className="text-xs" />
                          ) : (
                            <FaRobot className="text-xs" />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === "user" ? "You" : "AI Assistant"}
                          </span>
                        </div>
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={markdownComponents}
                              remarkPlugins={
                                [remarkGfm, remarkBreaks] as PluggableList
                              }
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                    </motion.div>
                  ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaComment className="text-2xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatWidget;
