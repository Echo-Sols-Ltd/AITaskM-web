'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Star, ThumbsUp, ThumbsDown, Bug, Lightbulb, Heart } from 'lucide-react';
import { useTranslations } from '@/contexts/I18nContext';

interface FeedbackType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function FeedbackPage() {
  const t = useTranslations('feedback');
  const [selectedType, setSelectedType] = useState('general');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',
    category: 'general',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes: FeedbackType[] = [
    {
      id: 'general',
      title: 'General Feedback',
      description: 'Share your thoughts about MoveIt',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'bug',
      title: 'Bug Report',
      description: 'Report a problem or issue',
      icon: <Bug className="w-6 h-6" />,
      color: 'bg-red-500'
    },
    {
      id: 'feature',
      title: 'Feature Request',
      description: 'Suggest a new feature',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },
    {
      id: 'compliment',
      title: 'Compliment',
      description: 'Share what you love about MoveIt',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-pink-500'
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const feedbackData = {
      ...formData,
      type: selectedType,
      rating: rating,
      timestamp: new Date().toISOString()
    };

    console.log('Feedback submitted:', feedbackData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        title: '',
        description: '',
        email: '',
        category: 'general',
        priority: 'medium'
      });
      setRating(0);
      setSelectedType('general');
    }, 3000);
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && rating > 0;

  if (isSubmitted) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You for Your Feedback!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve MoveIt for everyone.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We'll review your feedback and get back to you if needed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('title') || 'Feedback'}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What type of feedback do you have?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {feedbackTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedType === type.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center text-white mb-3`}>
                    {type.icon}
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {type.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How would you rate your overall experience?
            </h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief summary of your feedback"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="general">General</option>
                <option value="ui-ux">UI/UX</option>
                <option value="performance">Performance</option>
                <option value="features">Features</option>
                <option value="mobile">Mobile</option>
                <option value="integrations">Integrations</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please provide detailed feedback. Include steps to reproduce if reporting a bug."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com - We'll only use this to follow up on your feedback"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              * Required fields
            </p>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isFormValid && !isSubmitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips for Better Feedback
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Be specific about the issue or suggestion</li>
            <li>• Include steps to reproduce bugs</li>
            <li>• Mention your browser and device if relevant</li>
            <li>• Attach screenshots if helpful</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            🚀 What Happens Next?
          </h3>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>• We review all feedback within 24-48 hours</li>
            <li>• High priority issues are addressed first</li>
            <li>• You'll get updates if you provided an email</li>
            <li>• Feature requests are added to our roadmap</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
