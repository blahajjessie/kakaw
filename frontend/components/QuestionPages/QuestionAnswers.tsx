import { useState } from 'react';
import MatchMediaWrapper from '@/components/MatchMediaWrapper';
import SelectedImage from 'next/image';
import XMarkImage from 'public/remove1.png';
import CheckMarkImage from 'public/checkmark1.png';

import styles from '@/styles/flip.module.css';

interface QuestionAnswersProps {
  answers: [string, string, string, string];
  explanations: [string, string, string, string];
  onAnswerClick?: (answerIndex: number) => void;
  selectedAnswerIndex?: number | null;
}

export default function QuestionAnswers({
  answers,
  explanations,
  onAnswerClick,
  selectedAnswerIndex,
}: QuestionAnswersProps) {
  // State to keep track of selected answer and selected image
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(selectedAnswerIndex ?? null);
  const [selectedImage, setSelectedImage] = useState(selectedAnswerIndex === 0 ? XMarkImage : '');

  const handleAnswerClick = (index: number) => {
    // Toggle the selectedAnswer state for the clicked answer
    if (selectedAnswer === index) {
      setSelectedAnswer(null);
      setSelectedImage('');
    } else {
      setSelectedAnswer(index);
      setSelectedImage(index === 0 ?  XMarkImage : CheckMarkImage);
    }
  
    // Call the onAnswerClick function if it exists
    if (onAnswerClick) {
      onAnswerClick(index);
    }
  };  

  const getAnswerText = (index: number) => {
    // Check if the answer is selected and return the appropriate text
    if (selectedAnswer === index) {
      return explanations[index];
    } else {
      return answers[index];
    }
  };

  const mobileContent = (
    <div className="w-11/12 h-2/3 flex flex-col justify-between font-extrabold text-lg my-2">
      {answers.map((answer, index) => (
        <div
          key={index}
          className={`relative w-full h-1/4 ${
            index === 0
              ? 'bg-red-400'
              : index === 1
              ? 'bg-green-400'
              : index === 2
              ? 'bg-blue-400'
              : 'bg-yellow-400'
          } grid items-center justify-center text-center rounded-xl p-4 my-2 overflow-y-auto shadow-heavy hover:brightness-110`}
          onClick={() => handleAnswerClick(index)}
        >
          {/* Display Your Answer Rectangle if the current index matches selectedAnswerIndex */}
{index === selectedAnswer && onAnswerClick && selectedAnswerIndex !== undefined && (
  <div
    className="absolute bottom-0 left-0 flex justify-center items-center"
    style={{
      width: '100%',
      height: '25%',
      background: '#FF7200',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: '15px',
    }}
  >
    <p style={{ color: 'white', fontSize: '30px' }}>You Answered</p>
  </div>
)}

          {/* Flip Animation */}
          <div className={`${styles['answer-container']} ${selectedAnswer === index ? styles.flip : ''}`}>
            <div className={styles.answer}>{getAnswerText(index)}</div>
          </div>

          {/* Display X or Y image if the current index matches selectedAnswerIndex */}
          {selectedAnswer !== null && onAnswerClick && selectedAnswerIndex !== undefined && (
  <div className="absolute top-0 right-0 h-16 w-16">
    <SelectedImage src={selectedImage} alt="Selected Image" className="w-full h-full" />
  </div>
)}
        </div>
      ))}
    </div>
  );

  const desktopContent = (
    <div className="flex flex-wrap items-center justify-center grow gap-x-16 w-full font-extrabold text-3xl my-2 2xl:text-4xl">
      {answers.map((answer, index) => (
        <div
          key={index}
          className={`relative ${
            index === 0
              ? 'bg-red-400'
              : index === 1
              ? 'bg-green-400'
              : index === 2
              ? 'bg-blue-400'
              : 'bg-yellow-400'
          } grid items-center justify-center rounded-xl w-2/5 h-2/5 px-16 py-8 my-2 text-center overflow-y-auto shadow-heavy cursor-pointer hover:brightness-110`}
          onClick={() => handleAnswerClick(index)}
        >
          {/* Display Your Answer Rectangle if the current index matches selectedAnswerIndex */}
{index === selectedAnswer && onAnswerClick && selectedAnswerIndex !== undefined && (
  <div
    className="absolute bottom-0 left-0 flex justify-center items-center"
    style={{
      width: '100%',
      height: '25%',
      background: '#FF7200',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: '15px',
    }}
  >
    <p style={{ color: 'white', fontSize: '30px' }}>You Answered</p>
  </div>
)}

          {/* Flip Animation */}
          <div className={`${styles['answer-container']} ${selectedAnswer === index ? styles.flip : ''}`}>
            <div className={styles.answer}>{getAnswerText(index)}</div>
          </div>

          {/* Display X or Y image if the current index matches selectedAnswerIndex */}
          {selectedAnswer !== null && onAnswerClick && selectedAnswerIndex !== undefined && (
  <div className="absolute top-0 right-0 h-16 w-16">
    <SelectedImage src={selectedImage} alt="Selected Image" className="w-full h-full" />
  </div>
)}
        </div>
      ))}
    </div>
  );

  // Render the appropriate content based on the screen size
  return <MatchMediaWrapper mobileContent={mobileContent} desktopContent={desktopContent} />;
}
