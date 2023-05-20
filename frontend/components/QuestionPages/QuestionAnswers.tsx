import { useState } from 'react';
import MatchMediaWrapper from '@/components/MatchMediaWrapper';
import Image from 'next/image';
import X from 'public/remove 1.png';
import Y from 'public/check-mark 1.png';
import YourAnswer from 'public/YouAnswered.png';

import styles from '@/styles/flip.module.css';

interface QuestionAnswersProps {
  answers: [string, string, string, string];
  onAnswerClick: (answerIndex: number) => void;
  selectedAnswerIndex: number | null;
}

export default function QuestionAnswers({
  answers,
  onAnswerClick,
  selectedAnswerIndex,
}: QuestionAnswersProps) {
  // State to keep track of selected answers and selected image
  const [selectedAnswers, setSelectedAnswers] = useState<boolean[]>([false, false, false, false]);
  const [selectedImage, setSelectedImage] = useState(X); // Default image is X

  const handleAnswerClick = (index: number) => {
    // Call the provided onAnswerClick function
    onAnswerClick(index);
    // Update all selected answers to true
    const updatedSelectedAnswers = Array.from({ length: answers.length }, () => true);
    setSelectedAnswers(updatedSelectedAnswers);
    // Choose image X or Y based on the index
    setSelectedImage(index === 0 ? X : Y);
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
          {/* Display Your Answer Image if the current index matches selectedAnswerIndex */}
          {index === selectedAnswerIndex && (
            <div className="absolute bottom-0 left-0 w-full flex justify-center items-end">
              <Image src={YourAnswer} alt="Your Answer Image" className="w-full h-full" />
            </div>
          )}

          {/* Flip Animation */}
          <div className={`${styles['answer-container']} ${selectedAnswers[index] ? styles.flip : ''}`}>
            <div className={styles.answer}>{answer}</div>
          </div>

          {/* Display X or Y image if the current index matches selectedAnswerIndex */}
          {selectedAnswers[index] && (
            <div className="absolute top-0 right-0 h-16 w-16">
              <Image src={selectedImage} alt="Selected Image" className="w-full h-full" />
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
          {/* Display Your Answer Image if the current index matches selectedAnswerIndex */}
          {index === selectedAnswerIndex && (
            <div className="absolute bottom-0 left-0 w-full flex justify-center items-end">
              <Image src={YourAnswer} alt="Your Answer Image" className="w-full h-full" />
            </div>
          )}

          {/* Flip Animation */}
          <div className={`${styles['answer-container']} ${selectedAnswers[index] ? styles.flip : ''}`}>
            <div className={styles.answer}>{answer}</div>
          </div>

          {/* Display X or Y image if the current index matches selectedAnswerIndex */}
          {selectedAnswers[index] && (
            <div className="absolute top-0 right-0 h-16 w-16">
              <Image src={selectedImage} alt="Selected Image" className="w-full h-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Render the appropriate content based on the screen size
  return <MatchMediaWrapper mobileContent={mobileContent} desktopContent={desktopContent} />;
}
