import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchingQuestion } from '../../types/quiz';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MatchingProps {
  question: MatchingQuestion;
  onNext: (answer: Record<number, string>) => void;
}

interface Match {
  termIndex: number;
  definition: string;
}

const SortableDefinition = ({
  definition,
  id,
  isMatched,
}: {
  definition: string;
  id: string;
  isMatched: boolean;
  isDragging: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg mb-3 cursor-grab active:cursor-grabbing select-none
        ${isMatched
          ? 'bg-gray-300 text-gray-600 border-2 border-dashed border-gray-400'
          : 'bg-purple-100 text-purple-900 shadow-md border border-purple-200 hover:shadow-lg transition-shadow duration-200'}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center">
        {!isMatched && (
          <svg className="w-5 h-5 mr-2 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        )}
        <span>{definition}</span>
      </div>
    </motion.div>
  );
};

const DroppableTerm: React.FC<{ termId: string; children: React.ReactNode }> = ({ termId, children }) => {
  const { setNodeRef } = useDroppable({ id: termId });
  return <div ref={setNodeRef}>{children}</div>;
};

const Matching: React.FC<MatchingProps> = ({ question, onNext }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [availableDefinitions, setAvailableDefinitions] = useState<string[]>([]);
  const [activeDefinition, setActiveDefinition] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Initialize definitions
  useEffect(() => {
    const shuffledDefinitions = question.pairs.map((p) => p.definition).sort(() => Math.random() - 0.5);
    setAvailableDefinitions(shuffledDefinitions);
  }, [question]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDefinition(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDefinition(null);

    if (over && active.id !== over.id) {
      const definition = active.id as string;
      const termId = over.id as string;
      const termIndex = parseInt(termId.replace('term-', ''));
      
      if (!termId.startsWith('term-')) return;

      const existingMatchIndex = matches.findIndex((m) => m.termIndex === termIndex);
      if (existingMatchIndex >= 0) {
        const updatedMatches = [...matches];
        setAvailableDefinitions((prev) => [...prev, updatedMatches[existingMatchIndex].definition]);
        updatedMatches[existingMatchIndex] = { termIndex, definition };
        setMatches(updatedMatches);
      } else {
        setMatches((prev) => [...prev, { termIndex, definition }]);
      }
      
      setAvailableDefinitions((prev) => prev.filter((d) => d !== definition));
      setError(null);
    }
  };

  // Reset all matches
  const handleReset = () => {
    const allDefinitions = matches.map(m => m.definition).concat(availableDefinitions);
    setAvailableDefinitions(allDefinitions.sort(() => Math.random() - 0.5));
    setMatches([]);
    setError(null);
  };

  const handleSubmit = () => {
    if (matches.length !== question.pairs.length) {
      setError(`Please match all terms (${matches.length}/${question.pairs.length} matched)`);
      return;
    }
    const formattedAnswers: Record<number, string> = {};
    matches.forEach((match) => {
      formattedAnswers[match.termIndex] = match.definition;
    });
    onNext(formattedAnswers);
  };

  const getMatchForTerm = (termIndex: number) => matches.find((m) => m.termIndex === termIndex);

  const isDefinitionMatched = (definition: string) => matches.some((m) => m.definition === definition);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-8">
        {/* <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-3">
          {question.prompt}
        </h3> */}
        <div className="text-sm text-purple-600 font-medium mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Match each term with its correct definition
        </div>

        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Terms</h4>
              <div className="space-y-4">
                {question.pairs.map((pair, index) => {
                  const match = getMatchForTerm(index);
                  return (
                    <DroppableTerm key={index} termId={`term-${index}`}>
                      <motion.div
                        id={`term-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 transition-all duration-200
                          ${match ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-800">{pair.term}</div>
                          <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {index + 1}
                          </div>
                        </div>
                        {match ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-dashed border-gray-300"
                          >
                            <div className="text-sm text-purple-700">{match.definition}</div>
                          </motion.div>
                        ) : (
                          <div className="mt-3 p-2 border border-dashed border-gray-300 rounded text-sm text-gray-400 text-center">
                            Drop definition here
                          </div>
                        )}
                      </motion.div>
                    </DroppableTerm>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Definitions</h4>
              <SortableContext items={availableDefinitions} strategy={verticalListSortingStrategy}>
                {availableDefinitions.map((definition) => (
                  <SortableDefinition
                    key={definition}
                    id={definition}
                    definition={definition}
                    isMatched={isDefinitionMatched(definition)}
                    isDragging={activeDefinition === definition}
                  />
                ))}
                {availableDefinitions.length === 0 && (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    All definitions have been matched
                  </div>
                )}
              </SortableContext>
            </div>
          </div>

          <DragOverlay>
            {activeDefinition ? (
              <div className="p-4 rounded-lg bg-white shadow-lg border border-purple-100 cursor-grabbing">
                {activeDefinition}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="mt-8 mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-gray-600">
              {matches.length} of {question.pairs.length} terms matched
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((matches.length / question.pairs.length) * 100)}% complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(matches.length / question.pairs.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start"
            >
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end space-x-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReset}
          className="px-8 py-3 rounded-xl font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
        >
          Reset
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            matches.length === question.pairs.length
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg shadow-purple-100'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          Submit Answers
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Matching;