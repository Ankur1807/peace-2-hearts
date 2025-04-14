
import React from 'react';

const MentalHealthApproach: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 className="section-title text-3xl mb-6">Our Approach</h2>
        <p className="text-gray-600 mb-4">
          At Peace2Hearts, we understand that relationship challenges can significantly impact your mental wellbeing. Our approach combines evidence-based therapeutic techniques with compassionate support to help you navigate these difficult times.
        </p>
        <p className="text-gray-600 mb-4">
          Our licensed therapists specialize in relationship-focused mental health care and can help you develop coping strategies, process emotions, and rebuild your sense of self-worth and confidence.
        </p>
        <p className="text-gray-600">
          Whether you're dealing with anxiety, depression, trauma, or stress related to your relationships, our team is here to provide the support and guidance you need to heal and grow.
        </p>
      </div>
      <div>
        <h2 className="section-title text-3xl mb-6">What to Expect</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
              <span className="text-peacefulBlue text-sm">✓</span>
            </div>
            <p className="text-gray-600">Safe, confidential therapy sessions with a licensed professional</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
              <span className="text-peacefulBlue text-sm">✓</span>
            </div>
            <p className="text-gray-600">Personalized treatment plans based on your unique needs</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
              <span className="text-peacefulBlue text-sm">✓</span>
            </div>
            <p className="text-gray-600">Practical coping strategies to manage anxiety, stress, and depression</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
              <span className="text-peacefulBlue text-sm">✓</span>
            </div>
            <p className="text-gray-600">Emotional support and validation during difficult relationship transitions</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
              <span className="text-peacefulBlue text-sm">✓</span>
            </div>
            <p className="text-gray-600">Tools for rebuilding self-esteem and identity after relationship challenges</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MentalHealthApproach;
