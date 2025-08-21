import React from 'react';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Open menu"
    >
      <Menu className="text-gray-600" size={24} />
    </motion.button>
  );
};

export default MobileMenuButton;
