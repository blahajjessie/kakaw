import { useState } from 'react';
import QuestionTop from '@/components/QuestionPages/QuestionTop';
import QuestionAnswers from '@/components/QuestionPages/QuestionAnswers';
import PlayerQuestionBottom from '@/components/QuestionPages/PlayerQuestionBottom';

import Image from 'next/image';
import GoodJob from 'public/GoodJob.png';
import NoLuck from 'public/NoLuck.png';

export default function PlayerQuestionPage() {
  // State variables
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // Selected answer state
  const [selectedImage, setSelectedImage] = useState(GoodJob); // Default image is GoodJob

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Handle answer click event
  const handleAnswerClick = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);

    // Determine the selected image path based on your conditions
    const imagePath = determineSelectedImagePath(answerIndex);
    setSelectedImage(imagePath);

    toggleModal();
  };

  // Function to determine the selected image path based on conditions
  const determineSelectedImagePath = (answerIndex: number) => {
    // Add your conditions here to choose between GoodJob and NoLuck images
    // For example:
    if (answerIndex === 0) {
      return NoLuck; // Select NoLuck image
    } else {
      return GoodJob; // Select GoodJob image
    }
  };

  return (
    <main className="bg-purple-100 flex flex-col h-screen items-center">
      {/* Render the question header */}
      <QuestionTop qNum={1} qText={'What is your quest?'} qTime={75}></QuestionTop>

      {/* Render the question answers */}
      <QuestionAnswers
        answers={[
          'To pass 115a',
          'To make a real app',
          'To have something to put on my GitHub',
          'To seek the holy grail',
        ]}
        selectedAnswerIndex={selectedAnswer}
        onAnswerClick={handleAnswerClick}
      ></QuestionAnswers>

      {/* Render the player question bottom */}
      <PlayerQuestionBottom name={'Student Name'} score={5100}></PlayerQuestionBottom>

      {/* Render the modal when showModal is true */}
      {showModal && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
          {/* Render the selected image if selectedAnswer is not null */}
          {selectedAnswer !== null && (
            <Image
              src={selectedImage}
              alt="Popup Image"
              className="max-w-full max-h-full"
            />
          )}

          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-xl"
            onClick={toggleModal}
          >
            Close
          </button>
        </div>
      )}
    </main>
  );
}
