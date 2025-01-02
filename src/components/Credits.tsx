interface CreditsProps {
  isKeyboardVisible: boolean;
}

export const Credits: React.FC<CreditsProps> = ({ isKeyboardVisible }) => {
  return (
    <div 
      className={`transition-all duration-200 text-white/70 font-serif italic text-sm text-center ${
        isKeyboardVisible ? 'absolute top-0 right-4' : 'fixed bottom-4 right-4'
      }`}
    >
      <div>Created by Octako</div>
      <div>© 2024</div>
    </div>
  );
};