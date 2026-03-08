import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface Props {
  currentMonth: Date;
  onChangeMonth: (delta: number) => void;
}

export default function MonthNavigator({ currentMonth, onChangeMonth }: Props) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const [key, setKey] = useState(0);
  const prevMonth = useRef(currentMonth);

  const handleChange = (delta: 1 | -1) => {
    setDirection(delta);
    setKey((k) => k + 1);
    prevMonth.current = currentMonth;
    onChangeMonth(delta);
  };

  const isCurrentMonth =
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear();

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Container pill */}
      <div
        className="glass-card inline-flex items-center gap-4 rounded-2xl px-2 py-2 shadow-card"
      >
        {/* Prev */}
        <button
          onClick={() => handleChange(-1)}
          aria-label="Previous month"
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 bg-surface-alt border border-border-strong text-text-tertiary hover:bg-primary-dim hover:text-primary-light"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Month display */}
        <div className="flex items-center gap-2.5 min-w-[168px] justify-center">
          <Calendar size={15} className="text-primary" />
          <div className="relative overflow-hidden h-7 flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.span
                key={key}
                custom={direction}
                initial={{ y: direction * 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction * -20, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="text-base font-semibold whitespace-nowrap text-text-primary block"
              >
                {format(currentMonth, 'MMMM yyyy')}
              </motion.span>
            </AnimatePresence>
          </div>
          {isCurrentMonth && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-income-dim text-income border border-green-300"
            >
              Now
            </span>
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => handleChange(1)}
          aria-label="Next month"
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 bg-surface-alt border border-border-strong text-text-tertiary hover:bg-primary-dim hover:text-primary-light"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
