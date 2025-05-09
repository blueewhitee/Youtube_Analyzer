"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.1 * index,
      }
    })
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-200",
      darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900",
    )}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-10 py-4 px-6 flex items-center justify-between shadow-md",
        darkMode ? "bg-gray-800" : "bg-white",
      )}>
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
              fill="#FF0000"
            />
            <path d="M16.75 12L9.75 16.5V7.5L16.75 12Z" fill="white" />
          </svg>
          <h1 className="text-2xl font-bold">YouTube Insights</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={cn("p-2 rounded-full", darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800")}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={cn(
        "py-20 px-6",
        darkMode ? "bg-gray-800" : "bg-gradient-to-b from-white to-gray-100",
      )}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="initial"
              animate="animate"
              custom={0}
              variants={fadeIn}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Discover the Stories Hidden in Your
                <span className="text-[#FF0000] block mt-2">YouTube History</span>
              </h1>
              <p className="text-lg mb-8 opacity-80">
                Gain powerful insights into your viewing habits, content preferences, 
                and psychological patterns through AI-powered analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/upload">
                  <Button className="bg-[#FF0000] hover:bg-red-600 text-white px-8 py-6 text-lg rounded-md">
                    Analyze Your History
                  </Button>
                </Link>
                <Button className={cn(
                  "px-8 py-6 text-lg rounded-md",
                  darkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                )}>
                  View Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial="initial"
              animate="animate"
              custom={1}
              variants={fadeIn}
              className="relative"
            >
              <div className={cn(
                "rounded-2xl overflow-hidden shadow-xl",
                darkMode ? "bg-gray-900" : "bg-white"
              )}>
                <div className={cn(
                  "h-12 rounded-t-2xl flex items-center px-4",
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                )}>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-6">
                  <img 
                    src="/placeholder.svg" 
                    alt="YouTube Insights Dashboard Preview" 
                    className="w-full h-auto rounded-md"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={cn(
        "py-20 px-6",
        darkMode ? "bg-gray-900" : "bg-white",
      )}>
        <div className="container mx-auto">
          <motion.div 
            initial="initial"
            animate="animate"
            custom={2}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Powerful AI-Driven Insights</h2>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Our application leverages the Google Gemini API to analyze your YouTube history 
              and provide meaningful insights about your viewing patterns.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                ),
                title: "Category Distribution",
                description: "Understand which content categories dominate your viewing time."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Format Analysis",
                description: "Learn how much time you spend with short-form vs. long-form content."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Viewing Patterns",
                description: "Identify when and how you consume content across different time periods."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Topic Transitions",
                description: "Discover how you move between different content types and topics."
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="initial"
                animate="animate"
                custom={index + 3}
                variants={fadeIn}
                className={cn(
                  "rounded-xl p-6 text-center",
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                )}
              >
                <div className="flex justify-center items-center">
                  <div className={cn(
                    "text-[#FF0000]",
                    darkMode ? "opacity-90" : "opacity-80"
                  )}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="opacity-70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={cn(
        "py-20 px-6",
        darkMode ? "bg-gray-800" : "bg-gray-50",
      )}>
        <div className="container mx-auto">
          <motion.div 
            initial="initial"
            animate="animate"
            custom={7}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              A simple, secure process that preserves your privacy while providing deep insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Export Your History",
                description: "Download your YouTube history data from Google Takeout.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Upload & Analyze",
                description: "Upload your watch-history.json file and let our AI analyze the data.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Explore Insights",
                description: "Interact with visualizations and discover patterns in your viewing habits.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial="initial"
                animate="animate"
                custom={index + 8}
                variants={fadeIn}
                className={cn(
                  "relative rounded-xl p-8",
                  darkMode ? "bg-gray-700" : "bg-white",
                )}
              >
                <div className={cn(
                  "absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center",
                  "bg-[#FF0000] text-white font-bold"
                )}>
                  {step.step}
                </div>
                <div className="mt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="text-[#FF0000]">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="opacity-70">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={cn(
        "py-20 px-6",
        darkMode ? "bg-gray-900" : "bg-white",
      )}>
        <div className="container mx-auto">
          <motion.div 
            initial="initial"
            animate="animate"
            custom={11}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Why Analyze Your YouTube History?</h2>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Gain valuable insights that can help you make more mindful decisions about your digital content consumption.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {[
              {
                title: "Self-Awareness",
                description: "Understand your content preferences and viewing habits on a deeper level.",
              },
              {
                title: "Digital Wellbeing",
                description: "Identify patterns that might suggest mindless scrolling or compulsive viewing loops.",
              },
              {
                title: "Better Content Choices",
                description: "Make more intentional decisions about the content you consume based on data.",
              },
              {
                title: "Time Management",
                description: "See where your YouTube time is going and adjust your habits accordingly.",
              },
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                initial="initial"
                animate="animate"
                custom={index + 12}
                variants={fadeIn}
                className="flex"
              >
                <div className="mr-4 mt-1">
                  <div className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="opacity-70">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={cn(
        "py-20 px-6 bg-[#FF0000] text-white",
      )}>
        <div className="container mx-auto">
          <motion.div 
            initial="initial"
            animate="animate"
            custom={16}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Discover Your YouTube Story?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Get started now and uncover the patterns in your YouTube history with our AI-powered analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button className="bg-white text-[#FF0000] hover:bg-gray-100 px-8 py-6 text-lg rounded-md">
                  Start Your Analysis
                </Button>
              </Link>
              <Button className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-6 text-lg rounded-md">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={cn(
        "py-10 px-6",
        darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600",
      )}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
                  fill="#FF0000"
                />
                <path d="M16.75 12L9.75 16.5V7.5L16.75 12Z" fill="white" />
              </svg>
              <span className="font-semibold">YouTube Insights</span>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} YouTube Insights Dashboard • All Rights Reserved
            </div>
          </div>
          <Separator className="my-6" />
          <div className="text-center text-sm opacity-70">
            <p>
              This project is not affiliated with YouTube or Google. It is an independent tool for personal data analysis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}